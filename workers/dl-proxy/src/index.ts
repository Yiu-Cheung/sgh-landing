/**
 * Reverse proxy for dl.smartgalleryhub.com → R2 bucket sgh-downloads.
 * Increments per-platform download counters in KV, but ONLY for actual
 * installer downloads. update.json polls and forum/* image fetches no
 * longer touch KV, which is what used to pile up under `platform:other`.
 */

interface Env {
  BUCKET: R2Bucket;
  DL_COUNTERS: KVNamespace;
}

function platformFromKey(key: string): 'windows' | 'mac-arm64' | 'mac-intel' | 'mac' | null {
  const k = key.toLowerCase();
  if (k.endsWith('.exe') || k.includes('setup')) return 'windows';
  if (k.includes('arm64') || k.includes('silicon')) return 'mac-arm64';
  if (k.includes('x64') || k.includes('intel')) return 'mac-intel';
  if (k.endsWith('.dmg')) return 'mac';
  // Everything else (update.json, forum/*, robots.txt, bot scans, ...)
  // is not a real install — skip the KV write entirely.
  return null;
}

async function incr(kv: KVNamespace, key: string): Promise<void> {
  const current = await kv.get(key);
  const next = (parseInt(current ?? '0', 10) || 0) + 1;
  await kv.put(key, String(next));
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));
    if (!key) {
      return new Response('Not found', { status: 404 });
    }

    const obj =
      request.method === 'HEAD'
        ? await env.BUCKET.head(key)
        : await env.BUCKET.get(key, {
            range: request.headers,
            onlyIf: request.headers,
          });

    if (!obj) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('etag', obj.httpEtag);
    headers.set('cache-control', 'public, max-age=300');
    headers.set('accept-ranges', 'bytes');

    const isRangeRequest = !!request.headers.get('range');
    // R2 returns `range` only when it actually served a range; treat the
    // initial byte (or a non-range full GET) as the canonical install event.
    const isFirstByte =
      !isRangeRequest ||
      (obj as R2ObjectBody).range === undefined ||
      (obj as R2ObjectBody).range?.offset === 0;

    if (request.method === 'GET' && isFirstByte) {
      const platform = platformFromKey(key);
      if (platform !== null) {
        ctx.waitUntil(incr(env.DL_COUNTERS, `platform:${platform}`));
      }
    }

    if (request.method === 'HEAD') {
      return new Response(null, { headers, status: 200 });
    }

    const body = (obj as R2ObjectBody).body;
    if (!body) {
      return new Response(null, { headers, status: 304 });
    }
    return new Response(body, { headers, status: isRangeRequest ? 206 : 200 });
  },
};

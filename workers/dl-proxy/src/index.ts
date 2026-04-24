export interface Env {
  BUCKET: R2Bucket;
  DOWNLOADS: AnalyticsEngineDataset;
}

function platformFromKey(key: string): string {
  const k = key.toLowerCase();
  if (k.endsWith(".exe") || k.includes("setup")) return "windows";
  if (k.includes("arm64") || k.includes("silicon")) return "mac-arm64";
  if (k.includes("x64") || k.includes("intel")) return "mac-intel";
  if (k.endsWith(".dmg")) return "mac";
  return "other";
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));

    if (!key) {
      return new Response("Not found", { status: 404 });
    }

    const obj = request.method === "HEAD"
      ? await env.BUCKET.head(key)
      : await env.BUCKET.get(key, {
          range: request.headers.get("range") ?? undefined,
          onlyIf: request.headers,
        });

    if (!obj) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);
    headers.set("cache-control", "public, max-age=300");
    headers.set("accept-ranges", "bytes");

    const isRangeRequest = !!request.headers.get("range");
    const isFirstByte =
      !isRangeRequest ||
      (obj as R2ObjectBody).range === undefined ||
      ((obj as R2ObjectBody).range as R2Range | undefined)?.offset === 0;

    if (request.method === "GET" && isFirstByte) {
      ctx.waitUntil(
        (async () => {
          env.DOWNLOADS.writeDataPoint({
            blobs: [
              key,
              platformFromKey(key),
              request.headers.get("user-agent") ?? "",
              (request as any).cf?.country ?? "",
              (request as any).cf?.city ?? "",
            ],
            doubles: [1],
            indexes: [platformFromKey(key)],
          });
        })(),
      );
    }

    if (request.method === "HEAD") {
      return new Response(null, { headers, status: 200 });
    }

    const body = (obj as R2ObjectBody).body;
    if (!body) {
      return new Response(null, { headers, status: 304 });
    }
    return new Response(body, { headers, status: isRangeRequest ? 206 : 200 });
  },
};

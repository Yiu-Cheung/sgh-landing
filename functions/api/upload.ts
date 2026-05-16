/**
 * POST   /api/upload            multi-file create. Each file gets a new random key.
 * POST   /api/upload  + key=    replace mode: overwrite the existing key with one file.
 * DELETE /api/upload?key=...    remove an image.
 *
 * All paths require the `sgh_admin` cookie set by /api/auth.
 */

interface Env {
  DOWNLOADS: R2Bucket;
  UPLOAD_PASSWORD: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per file
const ALLOWED: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const PUBLIC_BASE = 'https://dl.smartgalleryhub.com/forum';
const PREFIX = 'forum/';
const COOKIE_NAME = 'sgh_admin';

function checkAuth(request: Request, env: Env): boolean {
  const cookie = request.headers.get('cookie') ?? '';
  const m = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`).exec(cookie);
  if (!m) return false;
  try {
    return decodeURIComponent(m[1]) === env.UPLOAD_PASSWORD;
  } catch {
    return false;
  }
}

function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

function isForumKey(key: string): boolean {
  // Block path traversal and writes outside the forum/ prefix.
  return key.startsWith(PREFIX) && !key.includes('..') && !key.includes('//');
}

function randomId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('origin');
  if (origin && !origin.endsWith('smartgalleryhub.com') && !origin.includes('localhost')) {
    return jsonError(403, 'Forbidden origin');
  }
  if (!checkAuth(request, env)) {
    return jsonError(401, 'Not logged in');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, 'Expected multipart/form-data');
  }

  const files = form.getAll('file').filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return jsonError(400, 'No files');
  }

  for (const f of files) {
    if (f.size > MAX_BYTES) {
      return jsonError(413, `${f.name} exceeds ${MAX_BYTES / 1024 / 1024} MB`);
    }
    if (!ALLOWED[f.type]) {
      return jsonError(415, `${f.name}: unsupported type ${f.type}`);
    }
  }

  // --- Replace mode -------------------------------------------------------
  const replaceKey = form.get('key');
  if (typeof replaceKey === 'string' && replaceKey.length > 0) {
    if (!isForumKey(replaceKey)) {
      return jsonError(400, 'Bad key');
    }
    if (files.length !== 1) {
      return jsonError(400, 'Replace expects exactly one file');
    }
    const f = files[0];
    await env.DOWNLOADS.put(replaceKey, f.stream(), {
      httpMetadata: {
        contentType: f.type,
        cacheControl: 'public, max-age=3600',
      },
    });
    const url = `${PUBLIC_BASE}/${replaceKey.slice(PREFIX.length)}`;
    return Response.json({ uploaded: [{ key: replaceKey, url, replaced: true }] });
  }

  // --- Multi-upload create flow ------------------------------------------
  const results = await Promise.all(
    files.map(async (f) => {
      const ext = ALLOWED[f.type];
      const key = `${PREFIX}${randomId()}.${ext}`;
      await env.DOWNLOADS.put(key, f.stream(), {
        httpMetadata: {
          contentType: f.type,
          cacheControl: 'public, max-age=3600',
        },
      });
      return { key, url: `${PUBLIC_BASE}/${key.slice(PREFIX.length)}` };
    }),
  );

  return Response.json({ uploaded: results });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env)) {
    return jsonError(401, 'Not logged in');
  }
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key || !isForumKey(key)) {
    return jsonError(400, 'Bad key');
  }
  await env.DOWNLOADS.delete(key);
  return Response.json({ ok: true, deleted: key });
};

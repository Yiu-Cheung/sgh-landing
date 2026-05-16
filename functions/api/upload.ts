/**
 * Upload an image to R2 under `forum/<random>.<ext>`.
 * Public URL: https://dl.smartgalleryhub.com/forum/<random>.<ext>
 *
 * Gated by a shared password (env var UPLOAD_PASSWORD).
 * Configure both the password and the R2 binding `DOWNLOADS` in the
 * Cloudflare Pages dashboard → Settings → Environment variables / Bindings.
 */

interface Env {
  DOWNLOADS: R2Bucket;
  UPLOAD_PASSWORD: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const PUBLIC_BASE = 'https://dl.smartgalleryhub.com/forum';

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function randomId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Same-origin check — block other sites from POSTing here.
  const origin = request.headers.get('origin');
  if (origin && !origin.endsWith('smartgalleryhub.com') && !origin.includes('localhost')) {
    return jsonError(403, 'Forbidden origin');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, 'Expected multipart/form-data');
  }

  const password = form.get('password');
  if (typeof password !== 'string' || password !== env.UPLOAD_PASSWORD) {
    return jsonError(401, 'Wrong password');
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return jsonError(400, 'Missing file');
  }
  if (file.size > MAX_BYTES) {
    return jsonError(413, `File too large (max ${MAX_BYTES / 1024 / 1024} MB)`);
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return jsonError(415, `Unsupported type: ${file.type}`);
  }

  const key = `forum/${randomId()}.${ext}`;
  await env.DOWNLOADS.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
  });

  const url = `${PUBLIC_BASE}/${key.slice('forum/'.length)}`;
  return new Response(JSON.stringify({ url }), {
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * GET /api/list → JSON list of every image under forum/, newest first.
 * Requires the `sgh_admin` cookie.
 */

interface Env {
  DOWNLOADS: R2Bucket;
  UPLOAD_PASSWORD: string;
}

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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env)) {
    return Response.json({ error: 'Not logged in' }, { status: 401 });
  }

  const listed = await env.DOWNLOADS.list({ prefix: PREFIX, limit: 1000 });
  const images = listed.objects
    .map((o) => ({
      key: o.key,
      url: `${PUBLIC_BASE}/${o.key.slice(PREFIX.length)}`,
      size: o.size,
      uploaded: o.uploaded.toISOString(),
    }))
    .sort((a, b) => b.uploaded.localeCompare(a.uploaded));

  return Response.json({ images });
};

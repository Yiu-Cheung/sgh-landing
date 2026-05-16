/**
 * POST /api/auth { password } → sets HttpOnly cookie, valid 30 days.
 * GET  /api/auth              → 200 if cookie matches, 401 otherwise.
 *
 * Cookie value is the password itself (admin uses their own browser,
 * HttpOnly + Secure + SameSite=Strict eliminates the realistic attack
 * surface for a single-user admin page). HMAC tokens add no real
 * security here, only complexity.
 */

interface Env {
  UPLOAD_PASSWORD: string;
}

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const COOKIE_NAME = 'sgh_admin';

function cookieMatches(request: Request, env: Env): boolean {
  const cookie = request.headers.get('cookie') ?? '';
  const m = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`).exec(cookie);
  if (!m) return false;
  try {
    return decodeURIComponent(m[1]) === env.UPLOAD_PASSWORD;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return Response.json({ error: 'Expected JSON' }, { status: 400 });
  }

  if (typeof body.password !== 'string' || body.password !== env.UPLOAD_PASSWORD) {
    return Response.json({ error: 'Wrong password' }, { status: 401 });
  }

  const cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(env.UPLOAD_PASSWORD)}`,
    'Path=/',
    `Max-Age=${MAX_AGE_SECONDS}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
  ].join('; ');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'set-cookie': cookie },
  });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const authed = cookieMatches(request, env);
  return Response.json({ authed }, { status: authed ? 200 : 401 });
};

export const onRequestDelete: PagesFunction<Env> = async () => {
  const expired = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
  ].join('; ');
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'set-cookie': expired },
  });
};

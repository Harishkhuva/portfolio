import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24; // 24 hours

function createSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }

  const timestamp = Date.now().toString();

  const signature = createHmac('sha256', secret)
    .update(timestamp)
    .digest('base64url');

  return `${timestamp}.${signature}`;
}

function verifySessionToken(token: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) return false;

  const [timestamp, signature] = token.split('.');

  if (!timestamp || !signature) return false;

  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) return false;

  const age = Date.now() - timestampNumber;

  if (age < 0 || age > SESSION_DURATION * 1000) {
    return false;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(timestamp)
    .digest('base64url');

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function getCookie(req: any): string | null {
  const cookies = req.headers?.cookie;

  if (!cookies) return null;

  const match = cookies.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function createCookie(token: string): string {
  const secure =
    process.env.VERCEL_ENV === 'production'
      ? '; Secure'
      : '';

  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_DURATION}`,
    secure.replace('; ', ''),
  ]
    .filter(Boolean)
    .join('; ');
}

function clearCookie(): string {
  const secure =
    process.env.VERCEL_ENV === 'production'
      ? '; Secure'
      : '';

  return [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    secure.replace('; ', ''),
  ]
    .filter(Boolean)
    .join('; ');
}

function sendJson(
  res: any,
  data: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  res.status(status);

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  try {
    // Check current login session
    if (req.method === 'GET') {
      const token = getCookie(req);

      return sendJson(res, {
        authenticated: token
          ? verifySessionToken(token)
          : false,
      });
    }

    // Login
    if (req.method === 'POST') {
      const body = req.body ?? {};

      const password =
        typeof body.password === 'string'
          ? body.password
          : '';

      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        return sendJson(
          res,
          {
            error:
              'Admin authentication is not configured',
          },
          500
        );
      }

      const passwordBuffer = Buffer.from(password);
      const expectedBuffer = Buffer.from(adminPassword);

      const validPassword =
        passwordBuffer.length === expectedBuffer.length &&
        timingSafeEqual(
          passwordBuffer,
          expectedBuffer
        );

      if (!validPassword) {
        return sendJson(
          res,
          {
            authenticated: false,
            error: 'Invalid password',
          },
          401
        );
      }

      const token = createSessionToken();

      return sendJson(
        res,
        { authenticated: true },
        200,
        {
          'Set-Cookie': createCookie(token),
        }
      );
    }

    // Logout
    if (req.method === 'DELETE') {
      return sendJson(
        res,
        { authenticated: false },
        200,
        {
          'Set-Cookie': clearCookie(),
        }
      );
    }

    res.setHeader('Allow', 'GET, POST, DELETE');

    return sendJson(
      res,
      { error: 'Method not allowed' },
      405
    );
  } catch (error) {
    console.error('Auth API error:', error);

    return sendJson(
      res,
      { error: 'Internal server error' },
      500
    );
  }
}
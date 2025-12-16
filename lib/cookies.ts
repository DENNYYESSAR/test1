/**
 * Cookie utility functions for the application
 */

/**
 * Parse cookie string into object
 */
export function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const key = parts[0]?.trim();
    const value = parts.slice(1).join('=').trim();
    
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}

/**
 * Serialize cookie with options
 */
export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const {
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'strict',
    maxAge,
    path = '/',
    domain,
  } = options;
  
  const parts = [`${name}=${encodeURIComponent(value)}`];
  
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  if (sameSite) parts.push(`SameSite=${sameSite}`);
  if (maxAge) parts.push(`Max-Age=${maxAge}`);
  if (path) parts.push(`Path=${path}`);
  if (domain) parts.push(`Domain=${domain}`);
  
  return parts.join('; ');
}

/**
 * Delete cookie by setting Max-Age to 0
 */
export function deleteCookie(name: string, path: string = '/'): string {
  return serializeCookie(name, '', { maxAge: 0, path });
}

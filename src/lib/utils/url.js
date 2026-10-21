/**
 * Domain & Base URL resolution engine for Comfort Trip
 * Supports multi-tier dynamic resolution across local development,
 * Vercel preview branch deployments, and the custom canonical production domain.
 */

/**
 * Resolves the base URL / site origin dynamically.
 * Priority:
 * 1. Incoming HTTP Request headers (x-forwarded-host / host, x-forwarded-proto)
 * 2. NEXT_PUBLIC_SITE_URL environment variable
 * 3. VERCEL_PROJECT_PRODUCTION_URL (Vercel canonical production domain)
 * 4. VERCEL_URL (Vercel deployment/preview branch domain)
 * 5. Production canonical domain (https://thecomforttrip.com)
 * 6. Local development fallback (http://localhost:3000)
 *
 * @param {Request|Headers|object|null} req - Optional NextRequest or headers object
 * @returns {string} The normalized base URL without trailing slash
 */
export function resolveBaseUrl(req = null) {
  // 1. Resolve from incoming HTTP Request or headers if available
  if (req) {
    try {
      const headers = req.headers || (typeof req.get === 'function' ? req : null);
      if (headers) {
        const getHeader = (name) => {
          if (typeof headers.get === 'function') return headers.get(name);
          return headers[name] || headers[name.toLowerCase()];
        };

        const forwardedHost = getHeader('x-forwarded-host');
        const host = forwardedHost || getHeader('host');
        const isLocalHost =
          host &&
          (host.includes('localhost') ||
            host.includes('127.0.0.1') ||
            host.startsWith('192.168.') ||
            host.startsWith('10.') ||
            host.includes(':3000'));
        const proto = getHeader('x-forwarded-proto') || (isLocalHost ? 'http' : 'https');

        if (host) {
          const cleanHost = host.split(',')[0].trim();
          return `${proto}://${cleanHost}`.replace(/\/$/, '');
        }
      }
    } catch {
      // Fall through to environment variable checks
    }
  }

  // 2. Explicit environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (envUrl && envUrl !== 'undefined') {
      return envUrl.replace(/\/$/, '');
    }
  }

  // 3. Vercel Production Custom Domain / Project URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/$/, '')}`;
  }

  // 4. Vercel Preview Branch Deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim().replace(/\/$/, '')}`;
  }

  // 5. Production Canonical Fallback
  if (process.env.NODE_ENV === 'production') {
    return 'https://thecomforttrip.com';
  }

  // 6. Local Development Fallback
  return 'http://localhost:3000';
}

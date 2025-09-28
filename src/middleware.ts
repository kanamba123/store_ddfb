
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const publicRoutes = ['/login', '/register'];
const neutralRoutes = ['/', '/about', '/contact'];

const countryToLanguage: Record<string, string> = {
  FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr', LU: 'fr', MC: 'fr',
  BI: 'rn', CD: 'fr', CG: 'fr', CI: 'fr', SN: 'fr', CM: 'fr',
  RW: 'rw', TZ: 'sw', UG: 'sw', ET: 'am', SO: 'so', ER: 'ti',
  SD: 'ar', SS: 'en',
  US: 'en', GB: 'en', AU: 'en', NZ: 'en', IE: 'en', ZA: 'en', 
  KE: 'sw', NG: 'en', GH: 'en', SG: 'en', IN: 'en',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es',
  DE: 'de', AT: 'de', LI: 'de'
};

const supportedLanguages = ['fr', 'en', 'es', 'de', 'rn', 'rw', 'sw'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const path = request.nextUrl.pathname;

  let detectedLanguage = 'en'; // fallback
  const cookieLanguage = request.cookies.get('userLanguage')?.value;

  if (cookieLanguage && supportedLanguages.includes(cookieLanguage)) {
    detectedLanguage = cookieLanguage;
  } else {
    const country =
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      (request as any).geo?.country;

    if (country && countryToLanguage[country]) {
      detectedLanguage = countryToLanguage[country];
    } else {
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage) {
        const browserLanguages = acceptLanguage.split(',').map(lang => {
          const [code] = lang.split(';');
          return code.substring(0, 2);
        });

        for (const lang of browserLanguages) {
          if (supportedLanguages.includes(lang)) {
            detectedLanguage = lang;
            break;
          }
        }
      }
    }
  }

  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      const redirectUrl = new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url);
      redirectUrl.searchParams.set('lang', detectedLanguage);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (publicRoutes.includes(path) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (neutralRoutes.includes(path) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();

  // ✅ cookie langue
  const currentLangCookie = request.cookies.get('userLanguage');
  if (!currentLangCookie || currentLangCookie.value !== detectedLanguage) {
    response.cookies.set('userLanguage', detectedLanguage, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  }

  response.headers.set('x-detected-language', detectedLanguage);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
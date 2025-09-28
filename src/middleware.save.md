// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_URL } from '@/config/API';

// Route definitions
const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const publicRoutes = ['/login', '/register', '/forgot-password', '/locales'];
const neutralRoutes = ['/', '/about', '/contact'];
const authApiRoutes = ['/api/auth'];

// Language configuration
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

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  // Language detection logic - FIXED
  let detectedLanguage = 'en'; // fallback
  
  // 1. Check URL parameter first (manual language switch)
  const urlLang = searchParams.get('lang');
  if (urlLang && supportedLanguages.includes(urlLang)) {
    detectedLanguage = urlLang;
  } 
  // 2. Check cookie next
  else {
    const cookieLanguage = request.cookies.get('userLanguage')?.value;
    if (cookieLanguage && supportedLanguages.includes(cookieLanguage)) {
      detectedLanguage = cookieLanguage;
    } 
    // 3. Check geo-location
    else {
      const country =
        request.headers.get('cf-ipcountry') ||
        request.headers.get('x-vercel-ip-country') ||
        (request as any).geo?.country;

      if (country && countryToLanguage[country]) {
        detectedLanguage = countryToLanguage[country];
      } 
      // 4. Check browser accept-language header
      else {
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
  }

  // Check if route is public or auth API
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  const isAuthApiRoute = authApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isNeutralRoute = neutralRoutes.includes(pathname);

  // Allow public routes, auth API routes, and neutral routes without authentication
  if (isPublicRoute || isAuthApiRoute || isNeutralRoute) {
    // Redirect authenticated users from public/neutral routes to dashboard
    if ((isPublicRoute || isNeutralRoute) && token && pathname !== '/') {
      const redirectUrl = new URL('/dashboard', request.url);
      redirectUrl.searchParams.set('lang', detectedLanguage);
      return NextResponse.redirect(redirectUrl);
    }
    
    const response = NextResponse.next();
    setLanguageCookie(response, detectedLanguage);
    return response;
  }

  // Check for protected routes
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Handle unauthenticated users for protected routes
  if (isProtectedRoute && !token) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    redirectUrl.searchParams.set('lang', detectedLanguage);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle authenticated users - verify permissions
  if (token) {
    try {
      const userMenus = await getUserMenuRoutes(token);
      const allowedRoutes = extractRoutesFromMenus(userMenus);
      
      // Check if current route is allowed for this user
      const isRouteAllowed = isPathAllowed(pathname, allowedRoutes);
      
      if (!isRouteAllowed) {
        // Redirect to welcome if route not allowed
        const redirectUrl = new URL('/dashboard/welcome', request.url);
        redirectUrl.searchParams.set('lang', detectedLanguage);
        return NextResponse.redirect(redirectUrl);
      }
      
      const response = NextResponse.next();
      setLanguageCookie(response, detectedLanguage);
      return response;
    } catch (error) {
      // Token is invalid, redirect to login
      console.error('Token validation error:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('lang', detectedLanguage);
      
      // Clear invalid token
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('authToken');
      setLanguageCookie(response, detectedLanguage);
      return response;
    }
  }

  // Default response for other routes
  const response = NextResponse.next();
  setLanguageCookie(response, detectedLanguage);
  return response;
}

// Function to set language cookie - FIXED
function setLanguageCookie(response: NextResponse, detectedLanguage: string) {
  response.cookies.set('userLanguage', detectedLanguage, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
    httpOnly: false, // Make accessible to client-side
  });
  response.headers.set('x-detected-language', detectedLanguage);
}

// Function to get user menu routes from your API
async function getUserMenuRoutes(token: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/user-menus/sidebar/9`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Remove cache to ensure fresh data
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user menus');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user menus:', error);
    return [];
  }
}

// Extract all routes from menu items recursively
function extractRoutesFromMenus(menus: any[]): string[] {
  const routes: string[] = [];
  
  function extractRoutes(items: any[]) {
    items.forEach(item => {
      if (item.route && item.route !== '#' && item.is_active && !item.is_deleted) {
        routes.push(item.route);
      }
      if (item.children && item.children.length > 0) {
        extractRoutes(item.children);
      }
    });
  }
  
  extractRoutes(menus);
  return routes;
}

// Check if path is allowed
function isPathAllowed(pathname: string, allowedRoutes: string[]): boolean {
  // Always allow welcome root
  if (pathname === '/dashboard/welcome') return true;
  
  // Check exact match or prefix match for nested routes
  return allowedRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(route + '/')
  );
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
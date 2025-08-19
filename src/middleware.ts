// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const publicRoutes = ['/login', '/register'];
const neutralRoutes = ['/', '/about', '/contact']; // Routes that do not require authentication but redirect if already logged in

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const path = request.nextUrl.pathname;

  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL(
        `/login?redirect=${encodeURIComponent(path)}`,
        request.url
      ));
    }
    return NextResponse.next();
  }

  // 2. Redirection pour les routes publiques si déjà connecté
  if (publicRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 3. Redirection pour les routes neutres si déjà connecté
  if (neutralRoutes.includes(path) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Pour toutes les autres routes
  return NextResponse.next();
}
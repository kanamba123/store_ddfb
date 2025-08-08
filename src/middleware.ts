// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  // Solution 1: Utiliser les cookies au lieu de localStorage
  const token = request.cookies.get('authToken')?.value;
  const path = request.nextUrl.pathname;

  // Redirection pour les routes protégées
  if (protectedRoutes.some(route => path.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL(
      `/login?redirect=${encodeURIComponent(path)}`,
      request.url
    ));
  }

  // Redirection pour les routes publiques quand connecté
  if (publicRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}
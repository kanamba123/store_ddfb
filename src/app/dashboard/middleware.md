import { API_URL } from '@/config/API';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/'];
const authApiRoutes = ['/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if it's an auth API route
  const isAuthApiRoute = authApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Allow public routes and auth API routes
  if (isPublicRoute || isAuthApiRoute) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and get user permissions (you might want to cache this)
  try {
    const userMenus = await getUserMenuRoutes(token);
    const allowedRoutes = extractRoutesFromMenus(userMenus);
    
    // Check if current route is allowed for this user
    const isRouteAllowed = isPathAllowed(pathname, allowedRoutes);
    
    if (!isRouteAllowed) {
      // Redirect to dashboard if route not allowed
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Function to get user menu routes from your API
async function getUserMenuRoutes(token: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/user-menus/sidebar/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'force-cache' // Cache for performance
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
    pathname.startsWith(route + '/') ||
    // Allow parent routes if any child is accessible
    (route === '#' && allowedRoutes.some(r => r.startsWith(pathname + '/')))
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
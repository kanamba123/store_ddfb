export const routeConfig = {
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/terms-of-service',
    '/privacy-policy'
  ],
  
  // API routes that should be accessible
  apiRoutes: [
    '/api/auth',
    '/api/public'
  ],
  
  // Default redirect after login
  defaultRedirect: '/dashboard'
};
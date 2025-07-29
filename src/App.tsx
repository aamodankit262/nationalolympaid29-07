
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import LoaderWithBackground from "./components/LoaderWithBackground";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { Suspense, useEffect } from "react";
import { allRoutes, notFoundRoute, RouteConfig } from "./helper/routes";

const queryClient = new QueryClient();

const ErrorFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">Please refresh the page and try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

// Helper function to wrap routes with appropriate protection
const renderRoute = (route: RouteConfig) => {
  const Component = route.element;
  
  if (route.isProtected) {
    // Wrap with ProtectedRoute for private routes
    return (
      <ProtectedRoute
        requiredRoles={route.requiredRoles}
        requirePayment={route.requirePayment}
      >
        <Component />
      </ProtectedRoute>
    );
  } else {
    // Wrap with PublicRoute for public routes
    return (
      <PublicRoute restricted={route.isRestricted}>
        <Component />
      </PublicRoute>
    );
  }
};

const App = () => {
  //  useEffect(() => {
  //   const handleKeyDown = (e:any) => {
  //     if (
  //       e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
  //       (e.ctrlKey && e.key === 'U') 
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //     }
  //   };

  //   document.addEventListener('keydown', handleKeyDown);
  //   const handleContextMenu = (e:any) => {
  //     e.preventDefault(); 
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu); 

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu); 
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []); 

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={<LoaderWithBackground visible={true} />}>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // Reset state or perform any necessary cleanup
              console.log('Error boundary reset');
            }}
          >
            <Router >
              <Routes>
                {/* Render all routes with appropriate protection */}
                {allRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={renderRoute(route)}
                  />
                ))}
                
                {/* 404 Not Found route */}
                <Route
                  path={notFoundRoute.path}
                  element={<notFoundRoute.element />}
                />
              </Routes>
            </Router>
          </ErrorBoundary>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;

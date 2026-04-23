import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-primary-container shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="absolute left-4 top-6 z-50">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <Sidebar className="w-full flex-1" />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Fixed width 280px on large screens */}
      <Sidebar className="hidden lg:flex w-[280px] shrink-0 sticky top-0 h-screen" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:px-12 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

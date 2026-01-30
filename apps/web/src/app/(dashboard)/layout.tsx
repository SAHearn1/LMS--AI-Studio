'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layouts/Sidebar';
import { useUserStore } from '@/stores/userStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, token, isLoading, fetchCurrentUser } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If we have a token but no user, try to fetch user profile
    if (token && !user && !isLoading) {
      fetchCurrentUser().finally(() => setAuthChecked(true));
    } else if (!token) {
      // No token, redirect to login
      router.replace('/login');
    } else {
      setAuthChecked(true);
    }
  }, [mounted, token, user, isLoading, fetchCurrentUser, router]);

  // Show loading while checking auth
  if (!mounted || !authChecked || isLoading) {
    return (
      <div className="min-h-screen bg-canvas-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-evergreen mx-auto mb-4"></div>
          <p className="text-leaf text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after auth check, they'll be redirected
  if (!user) {
    return (
      <div className="min-h-screen bg-canvas-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-evergreen mx-auto mb-4"></div>
          <p className="text-leaf text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-light">
      <div className="flex">
        <Sidebar 
          userRole={user.role} 
          userName={`${user.firstName} ${user.lastName}`} 
        />
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

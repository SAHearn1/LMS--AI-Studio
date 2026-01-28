'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { useUserStore } from '@/stores/userStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-canvas-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-evergreen"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-light">
      <div className="flex">
        <Sidebar 
          userRole={user?.role || 'STUDENT'} 
          userName={user ? `${user.firstName} ${user.lastName}` : 'Guest'} 
        />
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-evergreen"></div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

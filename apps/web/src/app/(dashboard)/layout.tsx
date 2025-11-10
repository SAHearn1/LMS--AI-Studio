import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar will go here */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

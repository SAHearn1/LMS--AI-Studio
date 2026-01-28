'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  BarChart3,
  Settings,
  LogOut,
  Sprout,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Courses', href: '/courses', icon: BookOpen },
  { label: 'Lessons', href: '/lessons', icon: GraduationCap, roles: ['TEACHER', 'ADMIN'] },
  { label: 'Students', href: '/students', icon: Users, roles: ['TEACHER', 'ADMIN'] },
  { label: 'Assignments', href: '/assignments', icon: FileText },
  { label: 'Progress', href: '/progress', icon: BarChart3 },
  { label: 'Garden', href: '/garden', icon: Sprout, roles: ['STUDENT'] },
];

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export function Sidebar({ userRole = 'TEACHER', userName = 'User' }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = navItems.filter(
    item => !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-evergreen text-gold-leaf"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-evergreen text-white transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-leaf">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Sprout className="h-8 w-8 text-gold-leaf" />
              <span className="font-display text-xl font-bold text-gold-leaf">RootWork</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-gold-leaf text-evergreen font-medium" 
                      : "text-canvas-light hover:bg-leaf hover:text-white"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-leaf">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 rounded-full bg-gold-leaf flex items-center justify-center text-evergreen font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-canvas-light capitalize">{userRole.toLowerCase()}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-canvas-light hover:bg-leaf hover:text-white transition-colors"
              >
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-canvas-light hover:bg-leaf hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

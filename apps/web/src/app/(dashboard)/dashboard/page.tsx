'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  GraduationCap,
  Award,
  Calendar,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  pendingGrades: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrades: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const user = session?.user;
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  useEffect(() => {
    // Simulate fetching stats - replace with actual API call
    const timer = setTimeout(() => {
      setStats({
        totalCourses: 2,
        totalStudents: 4,
        totalAssignments: 1,
        pendingGrades: 0,
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-evergreen to-leaf rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, {firstName}! 🌱
        </h1>
        <p className="text-white/80 mb-1">
          {user?.email}
        </p>
        <p className="text-white/60 text-sm">
          Role: {user?.role}
        </p>
        <p className="text-white/80 mt-4">
          {isTeacher 
            ? "Here's an overview of your courses and students" 
            : isParent
            ? "Monitor your child's learning progress"
            : "Ready to continue your learning journey?"}
        </p>
        
        {isTeacher && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/courses/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-leaf text-evergreen rounded-lg hover:bg-olive-gold transition-colors font-medium text-sm"
            >
              <Plus size={18} />
              New Course
            </Link>
            <Link
              href="/lessons/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm"
            >
              <GraduationCap size={18} />
              AI Lesson Generator
            </Link>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label={isTeacher ? "Your Courses" : "Enrolled Courses"}
          value={stats.totalCourses}
          href="/courses"
          color="bg-evergreen"
        />
        {isTeacher && (
          <StatCard
            icon={Users}
            label="Students"
            value={stats.totalStudents}
            href="/students"
            color="bg-leaf"
          />
        )}
        <StatCard
          icon={FileText}
          label={isTeacher ? "Assignments" : "My Assignments"}
          value={stats.totalAssignments}
          href="/assignments"
          color="bg-gold-leaf"
        />
        {isTeacher ? (
          <StatCard
            icon={Award}
            label="Pending Grades"
            value={stats.pendingGrades}
            href="/assignments"
            color="bg-olive-gold"
          />
        ) : (
          <StatCard
            icon={TrendingUp}
            label="My Progress"
            value="View"
            href="/progress"
            color="bg-olive-gold"
          />
        )}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-charcoal">
              {isTeacher ? 'Your Courses' : 'Continue Learning'}
            </h2>
            <Link href="/courses" className="text-sm text-leaf hover:text-evergreen transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="text-center py-8 text-charcoal/60">
            <BookOpen className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">Course list coming soon</p>
            {isTeacher && (
              <Link
                href="/courses/new"
                className="mt-3 inline-flex items-center gap-1 text-sm text-leaf hover:text-evergreen"
              >
                <Plus size={16} /> Create your first course
              </Link>
            )}
          </div>
        </div>

        {/* Assignments Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-charcoal">Upcoming Deadlines</h2>
            <Link href="/assignments" className="text-sm text-leaf hover:text-evergreen transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="text-center py-8 text-charcoal/60">
            <Calendar className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">No upcoming deadlines</p>
          </div>
        </div>
      </div>

      {/* Quick Actions for Students */}
      {isStudent && (
        <div className="bg-canvas-light rounded-xl p-6">
          <h2 className="font-semibold text-lg text-charcoal mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={BookOpen}
              label="Browse Courses"
              href="/courses"
            />
            <QuickActionCard
              icon={FileText}
              label="My Assignments"
              href="/assignments"
            />
            <QuickActionCard
              icon={TrendingUp}
              label="View Progress"
              href="/progress"
            />
            <QuickActionCard
              icon={GraduationCap}
              label="My Garden"
              href="/student"
            />
          </div>
        </div>
      )}

      {/* Parent View */}
      {isParent && (
        <div className="bg-canvas-light rounded-xl p-6">
          <h2 className="font-semibold text-lg text-charcoal mb-4">Parent Dashboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <QuickActionCard
              icon={Users}
              label="My Children"
              href="/parent"
            />
            <QuickActionCard
              icon={TrendingUp}
              label="Progress Reports"
              href="/parent"
            />
            <QuickActionCard
              icon={Calendar}
              label="Upcoming Events"
              href="/parent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal/60 mb-1">{label}</p>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
        </div>
        <div className={cn('p-3 rounded-lg', color)}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </Link>
  );
}

// Quick Action Card
function QuickActionCard({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow text-center"
    >
      <div className="w-12 h-12 rounded-full bg-evergreen/10 flex items-center justify-center">
        <Icon className="text-evergreen" size={24} />
      </div>
      <span className="text-sm font-medium text-charcoal">{label}</span>
    </Link>
  );
}

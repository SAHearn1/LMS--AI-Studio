'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  GraduationCap,
  Award,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { useUserStore } from '@/stores/userStore';
import { Course, Assignment, CourseEnrollment, PaginatedResponse } from '@/types';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface DashboardData {
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalAssignments: number;
    pendingGrades: number;
  };
  recentCourses: Course[];
  upcomingAssignments: Assignment[];
  recentEnrollments: CourseEnrollment[];
}

export default function DashboardPage() {
  const { user } = useUserStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch courses
      const coursesRes = await api.get<PaginatedResponse<Course>>('/courses?limit=5');
      
      // Fetch assignments
      const assignmentsRes = await api.get<PaginatedResponse<Assignment>>('/assignments?status=PUBLISHED&limit=5');

      setData({
        stats: {
          totalCourses: coursesRes.data?.total || 0,
          totalStudents: 0, // Would come from dedicated stats endpoint
          totalAssignments: assignmentsRes.data?.total || 0,
          pendingGrades: 0,
        },
        recentCourses: coursesRes.data?.data || [],
        upcomingAssignments: (assignmentsRes.data?.data || [])
          .filter(a => a.dueDate && !isPast(new Date(a.dueDate)))
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()),
        recentEnrollments: [],
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setData({
        stats: { totalCourses: 0, totalStudents: 0, totalAssignments: 0, pendingGrades: 0 },
        recentCourses: [],
        upcomingAssignments: [],
        recentEnrollments: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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

  const stats = data?.stats || { totalCourses: 0, totalStudents: 0, totalAssignments: 0, pendingGrades: 0 };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-evergreen to-leaf rounded-2xl p-8 text-white">
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'User'}! 🌱
        </h1>
        <p className="text-canvas-light/80">
          {isTeacher 
            ? "Here's an overview of your courses and students" 
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-charcoal">
              {isTeacher ? 'Your Courses' : 'Continue Learning'}
            </h2>
            <Link href="/courses" className="text-sm text-leaf hover:text-evergreen transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {!data?.recentCourses || data.recentCourses.length === 0 ? (
            <div className="text-center py-8 text-charcoal/60">
              <BookOpen className="mx-auto h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">No courses yet</p>
              {isTeacher && (
                <Link
                  href="/courses/new"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-leaf hover:text-evergreen"
                >
                  <Plus size={16} /> Create your first course
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentCourses.slice(0, 4).map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-canvas-light/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-evergreen to-leaf flex items-center justify-center shrink-0">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <BookOpen className="text-gold-leaf/70" size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-charcoal truncate">{course.title}</h3>
                    <p className="text-sm text-charcoal/60">
                      {course._count?.lessons || 0} lessons · {course._count?.enrollments || 0} students
                    </p>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium shrink-0',
                    course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {course.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-charcoal">Upcoming Deadlines</h2>
            <Link href="/assignments" className="text-sm text-leaf hover:text-evergreen transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {!data?.upcomingAssignments || data.upcomingAssignments.length === 0 ? (
            <div className="text-center py-8 text-charcoal/60">
              <Calendar className="mx-auto h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingAssignments.slice(0, 4).map((assignment) => {
                const dueDate = new Date(assignment.dueDate!);
                const dueLabel = isToday(dueDate) ? 'Due Today' :
                               isTomorrow(dueDate) ? 'Due Tomorrow' :
                               `Due ${format(dueDate, 'MMM d')}`;
                const isUrgent = isToday(dueDate);

                return (
                  <Link
                    key={assignment.id}
                    href={`/assignments/${assignment.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-canvas-light/50 transition-colors"
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
                      isUrgent ? 'bg-red-100' : 'bg-gray-100'
                    )}>
                      <FileText className={isUrgent ? 'text-red-600' : 'text-charcoal/60'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-charcoal truncate">{assignment.title}</h3>
                      <p className="text-sm text-charcoal/60">
                        {assignment.maxPoints} points
                      </p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium shrink-0',
                      isUrgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    )}>
                      {dueLabel}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
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
              href="/garden"
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

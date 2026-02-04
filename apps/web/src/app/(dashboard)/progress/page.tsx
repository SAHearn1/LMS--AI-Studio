'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  FileText,
  Trophy,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { CourseEnrollment, LessonProgress, AssignmentSubmission } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

interface ProgressData {
  enrollments: CourseEnrollment[];
  lessonProgress: LessonProgress[];
  submissions: AssignmentSubmission[];
  stats: {
    totalCourses: number;
    completedLessons: number;
    totalLessons: number;
    submittedAssignments: number;
    totalAssignments: number;
    averageScore: number;
  };
}

export default function ProgressPage() {
  const { user } = useUserStore();
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    if (isStudent) {
      fetchStudentProgress();
    } else {
      fetchTeacherOverview();
    }
  }, [user?.role]);

  const fetchStudentProgress = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<ProgressData>('/progress/student');
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Set mock data for demo
      setData({
        enrollments: [],
        lessonProgress: [],
        submissions: [],
        stats: {
          totalCourses: 0,
          completedLessons: 0,
          totalLessons: 0,
          submittedAssignments: 0,
          totalAssignments: 0,
          averageScore: 0,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeacherOverview = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<ProgressData>('/progress/overview');
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch overview:', error);
      setData({
        enrollments: [],
        lessonProgress: [],
        submissions: [],
        stats: {
          totalCourses: 0,
          completedLessons: 0,
          totalLessons: 0,
          submittedAssignments: 0,
          totalAssignments: 0,
          averageScore: 0,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
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

  const stats = data?.stats || {
    totalCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    submittedAssignments: 0,
    totalAssignments: 0,
    averageScore: 0,
  };

  const completionRate = stats.totalLessons > 0
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-evergreen">Progress Dashboard</h1>
        <p className="text-charcoal/70 mt-1">
          {isStudent ? 'Track your learning journey' : 'Overview of student progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label="Enrolled Courses"
          value={stats.totalCourses}
          color="bg-evergreen"
        />
        <StatCard
          icon={CheckCircle2}
          label="Lessons Completed"
          value={`${stats.completedLessons}/${stats.totalLessons}`}
          subtext={`${completionRate}% complete`}
          color="bg-gold-leaf"
        />
        <StatCard
          icon={FileText}
          label="Assignments"
          value={`${stats.submittedAssignments}/${stats.totalAssignments}`}
          subtext="submitted"
          color="bg-leaf"
        />
        <StatCard
          icon={Trophy}
          label="Average Score"
          value={stats.averageScore > 0 ? `${Math.round(stats.averageScore)}%` : '-'}
          color="bg-olive-gold"
        />
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-lg text-charcoal mb-6">Course Progress</h2>
        
        {!data?.enrollments || data.enrollments.length === 0 ? (
          <div className="text-center py-12 text-charcoal/60">
            <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No course data available</p>
            {isStudent && (
              <Link
                href="/courses"
                className="mt-4 inline-block text-leaf hover:underline"
              >
                Browse courses to enroll
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {data.enrollments.map((enrollment) => (
              <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity (placeholder for future) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg text-charcoal mb-4 flex items-center gap-2">
            <Clock size={20} className="text-gold-leaf" />
            Upcoming Deadlines
          </h2>
          <div className="text-center py-8 text-charcoal/60">
            <p className="text-sm">No upcoming deadlines</p>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg text-charcoal mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-gold-leaf" />
            Recent Achievements
          </h2>
          <div className="text-center py-8 text-charcoal/60">
            <p className="text-sm">Complete lessons to earn achievements!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal/60 mb-1">{label}</p>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
          {subtext && <p className="text-sm text-charcoal/50 mt-1">{subtext}</p>}
        </div>
        <div className={cn('p-3 rounded-lg', color)}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}

// Course Progress Card
function CourseProgressCard({ enrollment }: { enrollment: CourseEnrollment }) {
  const progressPercent = Math.round(enrollment.progress);

  return (
    <Link
      href={`/courses/${enrollment.courseId}`}
      className="block p-4 rounded-lg border border-gray-100 hover:border-gold-leaf hover:bg-canvas-light/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-charcoal truncate">
            {enrollment.course?.title || 'Course'}
          </h3>
          {enrollment.course?.instructor && (
            <p className="text-sm text-charcoal/60">
              {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {progressPercent === 100 ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle2 size={16} />
              Complete
            </span>
          ) : (
            <span className="text-sm font-medium text-charcoal">{progressPercent}%</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            progressPercent === 100 ? 'bg-green-500' : 'bg-gold-leaf'
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Lesson dots */}
      {enrollment.course?.lessons && enrollment.course.lessons.length > 0 && (
        <div className="flex items-center gap-1 mt-3 flex-wrap">
          {enrollment.course.lessons.slice(0, 10).map((lesson, i) => (
            <div
              key={lesson.id}
              className={cn(
                'w-2 h-2 rounded-full',
                i < Math.floor((progressPercent / 100) * enrollment.course!.lessons!.length)
                  ? 'bg-gold-leaf'
                  : 'bg-gray-200'
              )}
              title={lesson.title}
            />
          ))}
          {enrollment.course.lessons.length > 10 && (
            <span className="text-xs text-charcoal/50 ml-1">
              +{enrollment.course.lessons.length - 10} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

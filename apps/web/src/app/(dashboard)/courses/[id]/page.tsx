'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  Users,
  FileText,
  Clock,
  Plus,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Course, Lesson, Assignment, CourseEnrollment } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

type Tab = 'lessons' | 'assignments' | 'students';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('lessons');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const courseId = params.id as string;
  const canManage = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const isInstructor = course?.instructorId === user?.id;

  useEffect(() => {
    fetchCourse();
    if (canManage) {
      fetchEnrollments();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Course>(`/courses/${courseId}`);
      if (response.data) {
        setCourse(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await api.get<CourseEnrollment[]>(`/courses/${courseId}/enrollments`);
      if (response.data) {
        setEnrollments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${courseId}`);
      router.push('/courses');
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) return;
    try {
      await api.post(`/courses/${courseId}/enroll`, { studentId: user.id });
      fetchEnrollments();
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-charcoal">Course not found</h2>
        <Link href="/courses" className="text-leaf hover:underline mt-2 inline-block">
          Back to courses
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/courses" className="p-2 rounded-lg hover:bg-white transition-colors mt-1">
            <ArrowLeft size={24} className="text-charcoal" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-bold text-evergreen">{course.title}</h1>
              <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getStatusColor(course.status))}>
                {course.status}
              </span>
            </div>
            {course.instructor && (
              <p className="text-charcoal/70">
                by {course.instructor.firstName} {course.instructor.lastName}
              </p>
            )}
          </div>
        </div>

        {(canManage || isInstructor) && (
          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${courseId}/edit`}
              className="p-2 rounded-lg hover:bg-white transition-colors"
            >
              <Edit size={20} className="text-charcoal" />
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Course Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Thumbnail */}
          <div className="md:col-span-1">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-evergreen to-leaf flex items-center justify-center overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="h-16 w-16 text-gold-leaf/50" />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            {course.description && (
              <p className="text-charcoal/80">{course.description}</p>
            )}

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-charcoal/70">
                <BookOpen size={18} className="text-leaf" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/70">
                <FileText size={18} className="text-leaf" />
                <span>{course.assignments?.length || 0} assignments</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/70">
                <Users size={18} className="text-leaf" />
                <span>{course._count?.enrollments || enrollments.length} students</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2 text-charcoal/70">
                  <Clock size={18} className="text-leaf" />
                  <span>{course.duration} hours</span>
                </div>
              )}
            </div>

            {/* Enroll button for students */}
            {user?.role === 'STUDENT' && (
              <button
                onClick={handleEnroll}
                className="mt-4 px-6 py-3 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium"
              >
                Enroll in Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['lessons', 'assignments', 'students'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize',
                activeTab === tab
                  ? 'border-gold-leaf text-evergreen'
                  : 'border-transparent text-charcoal/60 hover:text-charcoal'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'lessons' && (
          <LessonsTab
            lessons={course.lessons || []}
            courseId={courseId}
            canManage={canManage || isInstructor}
            onUpdate={fetchCourse}
          />
        )}
        {activeTab === 'assignments' && (
          <AssignmentsTab
            assignments={course.assignments || []}
            courseId={courseId}
            canManage={canManage || isInstructor}
          />
        )}
        {activeTab === 'students' && (
          <StudentsTab
            enrollments={enrollments}
            courseId={courseId}
            canManage={canManage || isInstructor}
            onUpdate={fetchEnrollments}
          />
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Delete Course</h3>
            <p className="text-charcoal/70 mb-6">
              Are you sure you want to delete &ldquo;{course.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Lessons Tab Component
function LessonsTab({
  lessons,
  courseId,
  canManage,
}: {
  lessons: Lesson[];
  courseId: string;
  canManage: boolean;
  onUpdate?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-charcoal">Course Lessons</h3>
        {canManage && (
          <div className="flex gap-2">
            <Link
              href={`/lessons/new?courseId=${courseId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              Add Lesson
            </Link>
            <Link
              href={`/lessons/generate?courseId=${courseId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-leaf text-evergreen rounded-lg hover:bg-olive-gold transition-colors text-sm font-medium"
            >
              <Sparkles size={18} />
              AI Generate
            </Link>
          </div>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12 text-charcoal/60">
          <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No lessons yet. {canManage && 'Add your first lesson to get started.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gold-leaf hover:bg-canvas-light/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-evergreen/10 flex items-center justify-center text-evergreen font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-charcoal group-hover:text-evergreen transition-colors">
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-charcoal/60 mt-1">
                    <span className="capitalize">{lesson.type.toLowerCase()}</span>
                    {lesson.duration && <span>{lesson.duration} min</span>}
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      lesson.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {lesson.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab({
  assignments,
  courseId,
  canManage,
}: {
  assignments: Assignment[];
  courseId: string;
  canManage: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-charcoal">Course Assignments</h3>
        {canManage && (
          <Link
            href={`/assignments/new?courseId=${courseId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Add Assignment
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-charcoal/60">
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No assignments yet. {canManage && 'Create your first assignment.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <Link
              key={assignment.id}
              href={`/assignments/${assignment.id}`}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gold-leaf hover:bg-canvas-light/30 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-charcoal group-hover:text-evergreen transition-colors">
                  {assignment.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-charcoal/60 mt-1">
                  <span>{assignment.maxPoints} points</span>
                  {assignment.dueDate && (
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                assignment.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-700'
                  : assignment.status === 'CLOSED'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-yellow-100 text-yellow-700'
              )}>
                {assignment.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Students Tab Component
function StudentsTab({
  enrollments,
  courseId,
  canManage,
  onUpdate,
}: {
  enrollments: CourseEnrollment[];
  courseId: string;
  canManage: boolean;
  onUpdate: () => void;
}) {
  const handleUnenroll = async (enrollmentId: string) => {
    try {
      await api.delete(`/enrollments/${enrollmentId}`);
      onUpdate();
    } catch (error) {
      console.error('Failed to unenroll student:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-charcoal">Enrolled Students</h3>
        {canManage && (
          <Link
            href={`/courses/${courseId}/enroll`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Enroll Students
          </Link>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 text-charcoal/60">
          <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No students enrolled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-leaf flex items-center justify-center text-evergreen font-semibold">
                  {enrollment.student?.firstName?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-medium text-charcoal">
                    {enrollment.student?.firstName} {enrollment.student?.lastName}
                  </h4>
                  <p className="text-sm text-charcoal/60">{enrollment.student?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-charcoal">
                    {Math.round(enrollment.progress)}% complete
                  </div>
                  <div className="w-24 h-2 bg-gray-100 rounded-full mt-1">
                    <div
                      className="h-full bg-gold-leaf rounded-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleUnenroll(enrollment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

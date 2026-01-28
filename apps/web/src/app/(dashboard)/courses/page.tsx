'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, BookOpen, Users, Clock } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Course, PaginatedResponse, CourseStatus } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const { user } = useUserStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const canManageCourses = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchCourses();
  }, [page, statusFilter]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }

      const response = await api.get<PaginatedResponse<Course>>(`/courses?${params}`);
      if (response.data) {
        setCourses(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-evergreen">Courses</h1>
          <p className="text-charcoal/70 mt-1">
            {canManageCourses ? 'Manage and create courses for your students' : 'Browse available courses'}
          </p>
        </div>
        {canManageCourses && (
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium"
          >
            <Plus size={20} />
            New Course
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-charcoal/60" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CourseStatus | 'ALL')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-charcoal/30" />
          <h3 className="mt-4 text-lg font-medium text-charcoal">No courses found</h3>
          <p className="mt-2 text-charcoal/60">
            {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first course'}
          </p>
          {canManageCourses && !searchQuery && (
            <Link
              href="/courses/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors"
            >
              <Plus size={20} />
              Create Course
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-evergreen to-leaf flex items-center justify-center">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-16 w-16 text-gold-leaf/50" />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg font-semibold text-evergreen group-hover:text-leaf transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium shrink-0', getStatusColor(course.status))}>
                    {course.status}
                  </span>
                </div>

                {course.description && (
                  <p className="text-charcoal/70 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-charcoal/60">
                  {course._count && (
                    <>
                      <span className="flex items-center gap-1">
                        <BookOpen size={16} />
                        {course._count.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {course._count.enrollments} students
                      </span>
                    </>
                  )}
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {course.duration}h
                    </span>
                  )}
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold-leaf flex items-center justify-center text-evergreen font-semibold text-sm">
                      {course.instructor.firstName.charAt(0)}
                    </div>
                    <span className="text-sm text-charcoal/70">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-charcoal/70">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

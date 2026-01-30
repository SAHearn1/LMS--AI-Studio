'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Lesson, PaginatedResponse, LessonStatus, Course } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

export default function LessonsPage() {
  const { user } = useUserStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLessons();
    fetchCourses();
  }, [page, courseFilter]);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (courseFilter !== 'ALL') {
        params.append('courseId', courseFilter);
      }

      const response = await api.get<PaginatedResponse<Lesson>>(`/lessons?${params}`);
      if (response.data) {
        setLessons(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get<PaginatedResponse<Course>>('/courses?limit=100');
      if (response.data) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return '🎬';
      case 'TEXT':
        return '📖';
      case 'QUIZ':
        return '❓';
      case 'ASSIGNMENT':
        return '📝';
      case 'INTERACTIVE':
        return '🎮';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-evergreen">Lessons</h1>
          <p className="text-charcoal/70 mt-1">Manage lessons across all courses</p>
        </div>
        <Link
          href="/lessons/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium"
        >
          <Plus size={20} />
          New Lesson
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-charcoal/60" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white"
          >
            <option value="ALL">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <GraduationCap className="mx-auto h-12 w-12 text-charcoal/30" />
          <h3 className="mt-4 text-lg font-medium text-charcoal">No lessons found</h3>
          <p className="mt-2 text-charcoal/60">
            {searchQuery ? 'Try adjusting your search' : 'Create your first lesson'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {filteredLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="flex items-center gap-4 p-4 hover:bg-canvas-light/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-evergreen/10 flex items-center justify-center text-2xl">
                {getTypeIcon(lesson.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-charcoal truncate">{lesson.title}</h3>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
                    lesson.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {lesson.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-charcoal/60">
                  <span className="capitalize">{lesson.type.toLowerCase()}</span>
                  {lesson.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {lesson.duration} min
                    </span>
                  )}
                </div>
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

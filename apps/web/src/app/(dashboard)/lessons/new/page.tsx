'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';
import { api } from '@/lib/api/client';
import { LessonFormData, LessonType, LessonStatus, Course, PaginatedResponse } from '@/types';

export default function NewLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get('courseId');
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<LessonFormData>({
    courseId: courseIdParam || '',
    title: '',
    content: '',
    orderIndex: 1,
    duration: undefined,
    type: 'TEXT',
    status: 'DRAFT',
    videoUrl: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseIdParam) {
      fetchNextOrderIndex(courseIdParam);
    }
  }, [courseIdParam]);

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

  const fetchNextOrderIndex = async (courseId: string) => {
    try {
      const response = await api.get<Course>(`/courses/${courseId}`);
      if (response.data) {
        const maxOrder = response.data.lessons?.reduce((max, l) => Math.max(max, l.orderIndex), 0) || 0;
        setFormData(prev => ({ ...prev, orderIndex: maxOrder + 1 }));
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['orderIndex', 'duration'].includes(name) 
        ? (value ? parseInt(value) : undefined) 
        : value,
    }));

    if (name === 'courseId' && value) {
      fetchNextOrderIndex(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/lessons', formData);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (courseIdParam) {
        router.push(`/courses/${courseIdParam}`);
      } else {
        router.push('/lessons');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={courseIdParam ? `/courses/${courseIdParam}` : '/lessons'}
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-charcoal" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-evergreen">Create New Lesson</h1>
          <p className="text-charcoal/70 mt-1">Add content to your course</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Course Selection */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-charcoal mb-2">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            id="courseId"
            name="courseId"
            required
            value={formData.courseId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white"
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-2">
            Lesson Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
        </div>

        {/* Type, Duration, Order */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-charcoal mb-2">
              Lesson Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white"
            >
              <option value="TEXT">Text</option>
              <option value="VIDEO">Video</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="INTERACTIVE">Interactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-charcoal mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration || ''}
              onChange={handleChange}
              placeholder="e.g., 30"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-charcoal mb-2">
              Order
            </label>
            <input
              type="number"
              id="orderIndex"
              name="orderIndex"
              min="1"
              value={formData.orderIndex}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
            />
          </div>
        </div>

        {/* Video URL (conditional) */}
        {formData.type === 'VIDEO' && (
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-charcoal mb-2">
              Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
            />
          </div>
        )}

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-charcoal mb-2">
            Content
          </label>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Simple toolbar */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = formData.content || '';
                  const selected = text.substring(start, end);
                  const newText = text.substring(0, start) + `**${selected}**` + text.substring(end);
                  setFormData(prev => ({ ...prev, content: newText }));
                }}
                className="px-3 py-1 text-sm font-bold hover:bg-gray-200 rounded transition-colors"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = formData.content || '';
                  const selected = text.substring(start, end);
                  const newText = text.substring(0, start) + `*${selected}*` + text.substring(end);
                  setFormData(prev => ({ ...prev, content: newText }));
                }}
                className="px-3 py-1 text-sm italic hover:bg-gray-200 rounded transition-colors"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = formData.content || '';
                  setFormData(prev => ({ ...prev, content: text + '\n## ' }));
                }}
                className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = formData.content || '';
                  setFormData(prev => ({ ...prev, content: text + '\n- ' }));
                }}
                className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
              >
                • List
              </button>
            </div>
            <textarea
              id="content"
              name="content"
              rows={12}
              value={formData.content || ''}
              onChange={handleChange}
              placeholder="Write your lesson content here... (Markdown supported)"
              className="w-full px-4 py-3 focus:outline-none resize-none"
            />
          </div>
          <p className="mt-1 text-sm text-charcoal/60">
            Supports Markdown formatting for rich text content
          </p>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-charcoal mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Link
            href={courseIdParam ? `/courses/${courseIdParam}` : '/lessons'}
            className="px-6 py-3 rounded-lg border border-gray-200 text-charcoal hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={20} />
                Create Lesson
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api/client';
import { AssignmentFormData, Course, PaginatedResponse } from '@/types';

export default function NewAssignmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get('courseId');

  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AssignmentFormData>({
    courseId: courseIdParam || '',
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPoints' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      const response = await api.post('/assignments', payload);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (courseIdParam) {
        router.push(`/courses/${courseIdParam}`);
      } else {
        router.push('/assignments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={courseIdParam ? `/courses/${courseIdParam}` : '/assignments'}
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-charcoal" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-evergreen">Create Assignment</h1>
          <p className="text-charcoal/70 mt-1">Add a new assignment for your students</p>
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
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter assignment title"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">
            Instructions
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Provide detailed instructions for this assignment..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent resize-none"
          />
        </div>

        {/* Due Date & Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-charcoal mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="maxPoints" className="block text-sm font-medium text-charcoal mb-2">
              Maximum Points
            </label>
            <input
              type="number"
              id="maxPoints"
              name="maxPoints"
              min="1"
              value={formData.maxPoints}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
            />
          </div>
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
            <option value="CLOSED">Closed</option>
          </select>
          <p className="mt-1 text-sm text-charcoal/60">
            Students can only see and submit published assignments
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Link
            href={courseIdParam ? `/courses/${courseIdParam}` : '/assignments'}
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
                Create Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

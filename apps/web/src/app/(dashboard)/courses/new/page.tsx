'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { CourseFormData } from '@/types';
import { useUserStore } from '@/stores/userStore';

export default function NewCoursePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: undefined,
    status: 'DRAFT',
    thumbnail: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/courses', {
        ...formData,
        instructorId: user?.id,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      router.push('/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/courses"
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-charcoal" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-evergreen">Create New Course</h1>
          <p className="text-charcoal/70 mt-1">Fill in the details to create a new course</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-2">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Describe what students will learn in this course"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent resize-none"
          />
        </div>

        {/* Duration & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-charcoal mb-2">
              Duration (hours)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration || ''}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
            />
          </div>

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
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-charcoal mb-2">
            Thumbnail URL
          </label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
          <p className="mt-1 text-sm text-charcoal/60">
            Optional: Add a thumbnail image for your course
          </p>
        </div>

        {/* Thumbnail Preview */}
        {formData.thumbnail && (
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Preview
            </label>
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Link
            href="/courses"
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
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

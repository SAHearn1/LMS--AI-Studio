'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, Save, RefreshCw, BookOpen } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Course, PaginatedResponse, LessonType, AIGeneratedLesson } from '@/types';

export default function GenerateLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get('courseId');

  const [courses, setCourses] = useState<Course[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLesson, setGeneratedLesson] = useState<AIGeneratedLesson | null>(null);

  const [formData, setFormData] = useState({
    courseId: courseIdParam || '',
    topic: '',
    gradeLevel: '',
    learningObjectives: '',
    duration: 30,
    type: 'TEXT' as LessonType,
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
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedLesson(null);

    try {
      const response = await api.post<AIGeneratedLesson>('/ai/generate-lesson', {
        topic: formData.topic,
        gradeLevel: formData.gradeLevel || undefined,
        learningObjectives: formData.learningObjectives
          ? formData.learningObjectives.split('\n').filter(Boolean)
          : undefined,
        duration: formData.duration,
        type: formData.type,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setGeneratedLesson(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lesson');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLesson || !formData.courseId) return;

    setIsSaving(true);
    setError(null);

    try {
      // Get next order index
      const courseResponse = await api.get<Course>(`/courses/${formData.courseId}`);
      const maxOrder = courseResponse.data?.lessons?.reduce((max, l) => Math.max(max, l.orderIndex), 0) || 0;

      const response = await api.post('/lessons', {
        courseId: formData.courseId,
        title: generatedLesson.title,
        content: generatedLesson.content,
        orderIndex: maxOrder + 1,
        duration: formData.duration,
        type: formData.type,
        status: 'DRAFT',
      });

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
      setError(err instanceof Error ? err.message : 'Failed to save lesson');
    } finally {
      setIsSaving(false);
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
          <h1 className="font-display text-3xl font-bold text-evergreen flex items-center gap-3">
            <Sparkles className="text-gold-leaf" />
            AI Lesson Generator
          </h1>
          <p className="text-charcoal/70 mt-1">Use AI to create engaging lesson content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg text-charcoal mb-4">Generation Parameters</h2>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white text-sm"
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-charcoal mb-2">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                required
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Introduction to Photosynthesis"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent text-sm"
              />
            </div>

            {/* Grade Level */}
            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-charcoal mb-2">
                Grade Level
              </label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white text-sm"
              >
                <option value="">Any grade</option>
                <option value="K">Kindergarten</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                  <option key={g} value={g.toString()}>Grade {g}</option>
                ))}
              </select>
            </div>

            {/* Type & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-charcoal mb-2">
                  Lesson Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white text-sm"
                >
                  <option value="TEXT">Text Lesson</option>
                  <option value="VIDEO">Video Script</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="INTERACTIVE">Interactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-charcoal mb-2">
                  Duration (min)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="5"
                  max="120"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <label htmlFor="learningObjectives" className="block text-sm font-medium text-charcoal mb-2">
                Learning Objectives (one per line)
              </label>
              <textarea
                id="learningObjectives"
                name="learningObjectives"
                rows={3}
                value={formData.learningObjectives}
                onChange={handleChange}
                placeholder="Students will be able to...&#10;Understand the concept of...&#10;Apply knowledge to..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent resize-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !formData.topic}
              className="w-full py-3 bg-gold-leaf text-evergreen rounded-lg hover:bg-olive-gold transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Lesson
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Output */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-charcoal">Generated Content</h2>
            {generatedLesson && (
              <button
                onClick={() => handleGenerate({ preventDefault: () => {} } as React.FormEvent)}
                className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-gray-100 rounded-lg transition-colors"
                title="Regenerate"
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>

          {!generatedLesson ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-charcoal/40">
              <BookOpen size={48} className="mb-4" />
              <p className="text-center">
                Fill in the parameters and click "Generate Lesson"<br />
                to create AI-powered content
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
                <div className="p-3 bg-canvas-light/50 rounded-lg text-charcoal font-medium">
                  {generatedLesson.title}
                </div>
              </div>

              {/* Objectives */}
              {generatedLesson.objectives && generatedLesson.objectives.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Learning Objectives
                  </label>
                  <ul className="p-3 bg-canvas-light/50 rounded-lg space-y-1">
                    {generatedLesson.objectives.map((obj, i) => (
                      <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                        <span className="text-gold-leaf">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Content</label>
                <div className="p-3 bg-canvas-light/50 rounded-lg text-sm text-charcoal max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                  {generatedLesson.content}
                </div>
              </div>

              {/* Activities */}
              {generatedLesson.activities && generatedLesson.activities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Suggested Activities
                  </label>
                  <ul className="p-3 bg-canvas-light/50 rounded-lg space-y-1">
                    {generatedLesson.activities.map((activity, i) => (
                      <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                        <span className="text-gold-leaf">{i + 1}.</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.courseId}
                className="w-full py-3 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save as Lesson
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

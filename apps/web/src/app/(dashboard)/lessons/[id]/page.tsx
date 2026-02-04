'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  Play,
  BookOpen,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Lesson, LessonProgress } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const lessonId = params.id as string;
  const canManage = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    fetchLesson();
    if (isStudent) {
      fetchProgress();
    }
  }, [lessonId, isStudent]);

  const fetchLesson = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Lesson>(`/lessons/${lessonId}`);
      if (response.data) {
        setLesson(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get<LessonProgress>(`/lessons/${lessonId}/progress`);
      if (response.data) {
        setProgress(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await api.post(`/lessons/${lessonId}/complete`);
      fetchProgress();
    } catch (error) {
      console.error('Failed to mark complete:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/lessons/${lessonId}`);
      router.push(lesson?.courseId ? `/courses/${lesson.courseId}` : '/lessons');
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Play className="text-gold-leaf" size={24} />;
      case 'TEXT':
        return <BookOpen className="text-gold-leaf" size={24} />;
      default:
        return <BookOpen className="text-gold-leaf" size={24} />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-charcoal">Lesson not found</h2>
        <Link href="/lessons" className="text-leaf hover:underline mt-2 inline-block">
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={lesson.courseId ? `/courses/${lesson.courseId}` : '/lessons'}
            className="p-2 rounded-lg hover:bg-white transition-colors mt-1"
          >
            <ArrowLeft size={24} className="text-charcoal" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-lg bg-evergreen/10">
                {getTypeIcon(lesson.type)}
              </span>
              <h1 className="font-display text-3xl font-bold text-evergreen">
                {lesson.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-charcoal/60">
              <span className="capitalize">{lesson.type.toLowerCase()} lesson</span>
              {lesson.duration && (
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {lesson.duration} minutes
                </span>
              )}
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                lesson.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              )}>
                {lesson.status}
              </span>
            </div>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Link
              href={`/lessons/${lessonId}/edit`}
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

      {/* Progress Banner for Students */}
      {isStudent && (
        <div className={cn(
          'rounded-xl p-4 flex items-center justify-between',
          progress?.completed ? 'bg-green-50 border border-green-200' : 'bg-canvas-light border border-gold-leaf/30'
        )}>
          <div className="flex items-center gap-3">
            {progress?.completed ? (
              <>
                <CheckCircle2 className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-green-800">Lesson Completed!</p>
                  <p className="text-sm text-green-600">
                    Great job! You&apos;ve finished this lesson.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-gold-leaf flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gold-leaf" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">In Progress</p>
                  <p className="text-sm text-charcoal/60">
                    Read through the content and mark as complete when done.
                  </p>
                </div>
              </>
            )}
          </div>
          {!progress?.completed && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium disabled:opacity-50"
            >
              {isCompleting ? 'Saving...' : 'Mark Complete'}
            </button>
          )}
        </div>
      )}

      {/* Video Player (if video lesson) */}
      {lesson.type === 'VIDEO' && lesson.videoUrl && (
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src={lesson.videoUrl.replace('watch?v=', 'embed/')}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {lesson.content ? (
          <div className="prose prose-evergreen max-w-none">
            {/* Simple markdown-like rendering */}
            {lesson.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-6 mb-4 text-evergreen">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold mt-5 mb-3 text-evergreen">{line.slice(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-medium mt-4 mb-2 text-charcoal">{line.slice(4)}</h3>;
              }
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return <li key={i} className="ml-4 text-charcoal/80">{line.slice(2)}</li>;
              }
              if (line.match(/^\d+\. /)) {
                return <li key={i} className="ml-4 list-decimal text-charcoal/80">{line.replace(/^\d+\. /, '')}</li>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-charcoal my-2">{line.slice(2, -2)}</p>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="text-charcoal/80 my-2">{line}</p>;
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-charcoal/60">
            <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No content available for this lesson yet.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href={lesson.courseId ? `/courses/${lesson.courseId}` : '/lessons'}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back to Course
        </Link>
        {isStudent && !progress?.completed && (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-6 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium disabled:opacity-50"
          >
            {isCompleting ? 'Saving...' : 'Complete & Continue →'}
          </button>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Delete Lesson</h3>
            <p className="text-charcoal/70 mb-6">
              Are you sure you want to delete &ldquo;{lesson.title}&rdquo;? This action cannot be undone.
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

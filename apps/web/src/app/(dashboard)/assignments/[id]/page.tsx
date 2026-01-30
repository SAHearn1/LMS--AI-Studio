'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Award,
  Clock,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Assignment, AssignmentSubmission, SubmissionStatus } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import { format, isPast } from 'date-fns';

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [mySubmission, setMySubmission] = useState<AssignmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const assignmentId = params.id as string;
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    fetchAssignment();
    if (isTeacher) {
      fetchSubmissions();
    }
  }, [assignmentId, isTeacher]);

  const fetchAssignment = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Assignment>(`/assignments/${assignmentId}`);
      if (response.data) {
        setAssignment(response.data);
        // Find student's own submission
        if (isStudent && response.data.submissions) {
          const mine = response.data.submissions.find(s => s.studentId === user?.id);
          setMySubmission(mine || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.get<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`);
      if (response.data) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/assignments/${assignmentId}`);
      router.push('/assignments');
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-charcoal">Assignment not found</h2>
        <Link href="/assignments" className="text-leaf hover:underline mt-2 inline-block">
          Back to assignments
        </Link>
      </div>
    );
  }

  const isOverdue = assignment.dueDate && isPast(new Date(assignment.dueDate));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/assignments" className="p-2 rounded-lg hover:bg-white transition-colors mt-1">
            <ArrowLeft size={24} className="text-charcoal" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-bold text-evergreen">{assignment.title}</h1>
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                assignment.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                assignment.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              )}>
                {assignment.status}
              </span>
            </div>
            {assignment.course && (
              <Link href={`/courses/${assignment.courseId}`} className="text-leaf hover:underline">
                {assignment.course.title}
              </Link>
            )}
          </div>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-2">
            <Link
              href={`/assignments/${assignmentId}/edit`}
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

      {/* Assignment Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2 text-charcoal/70">
            <Award size={18} className="text-gold-leaf" />
            <span className="font-medium">{assignment.maxPoints} points</span>
          </div>
          {assignment.dueDate && (
            <div className={cn(
              'flex items-center gap-2',
              isOverdue ? 'text-red-600' : 'text-charcoal/70'
            )}>
              <Calendar size={18} />
              <span>Due: {format(new Date(assignment.dueDate), 'PPp')}</span>
              {isOverdue && <span className="font-medium">(Overdue)</span>}
            </div>
          )}
        </div>

        {assignment.description && (
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Instructions</h3>
            <div className="text-charcoal/80 whitespace-pre-wrap">{assignment.description}</div>
          </div>
        )}
      </div>

      {/* Student Submission View */}
      {isStudent && (
        <StudentSubmissionSection
          assignment={assignment}
          submission={mySubmission}
          onSubmit={fetchAssignment}
        />
      )}

      {/* Teacher Submissions View */}
      {isTeacher && (
        <TeacherSubmissionsSection
          assignment={assignment}
          submissions={submissions}
          onGrade={fetchSubmissions}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Delete Assignment</h3>
            <p className="text-charcoal/70 mb-6">
              Are you sure you want to delete this assignment? All submissions will be lost.
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

// Student Submission Section
function StudentSubmissionSection({
  assignment,
  submission,
  onSubmit,
}: {
  assignment: Assignment;
  submission: AssignmentSubmission | null;
  onSubmit: () => void;
}) {
  const [content, setContent] = useState(submission?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/assignments/${assignment.id}/submit`, { content });
      onSubmit();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGraded = submission?.status === 'GRADED' || submission?.status === 'RETURNED';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-lg text-charcoal mb-4">Your Submission</h3>

      {isGraded ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-800">
                Score: {submission.score} / {assignment.maxPoints}
              </p>
              <p className="text-sm text-green-700">
                Submitted on {submission.submittedAt && format(new Date(submission.submittedAt), 'PPp')}
              </p>
            </div>
          </div>

          {submission.feedback && (
            <div className="p-4 bg-canvas-light/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-charcoal font-medium">
                <MessageSquare size={18} />
                Feedback
              </div>
              <p className="text-charcoal/80">{submission.feedback}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Your Response</label>
            <div className="p-4 bg-gray-50 rounded-lg text-charcoal/80 whitespace-pre-wrap">
              {submission.content || 'No content submitted'}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {submission?.status === 'SUBMITTED' && (
            <div className="p-4 bg-blue-50 rounded-lg text-blue-800">
              <p className="font-medium">Submission received</p>
              <p className="text-sm">
                Submitted on {submission.submittedAt && format(new Date(submission.submittedAt), 'PPp')}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-charcoal mb-2">
              Your Answer
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your response here..."
              disabled={submission?.status === 'SUBMITTED'}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {submission?.status !== 'SUBMITTED' && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="w-full py-3 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Assignment
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Teacher Submissions Section
function TeacherSubmissionsSection({
  assignment,
  submissions,
  onGrade,
}: {
  assignment: Assignment;
  submissions: AssignmentSubmission[];
  onGrade: () => void;
}) {
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isGrading, setIsGrading] = useState(false);

  const handleGrade = async (submissionId: string) => {
    setIsGrading(true);
    try {
      await api.patch(`/submissions/${submissionId}/grade`, { score, feedback });
      setGradingId(null);
      setScore(0);
      setFeedback('');
      onGrade();
    } catch (error) {
      console.error('Failed to grade:', error);
    } finally {
      setIsGrading(false);
    }
  };

  const startGrading = (submission: AssignmentSubmission) => {
    setGradingId(submission.id);
    setScore(submission.score || 0);
    setFeedback(submission.feedback || '');
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'GRADED':
        return 'bg-green-100 text-green-800';
      case 'RETURNED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-lg text-charcoal mb-4">
        Submissions ({submissions.length})
      </h3>

      {submissions.length === 0 ? (
        <div className="text-center py-8 text-charcoal/60">
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="border border-gray-100 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-leaf flex items-center justify-center text-evergreen font-semibold">
                    {submission.student?.firstName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">
                      {submission.student?.firstName} {submission.student?.lastName}
                    </p>
                    <p className="text-sm text-charcoal/60">{submission.student?.email}</p>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(submission.status))}>
                  {submission.status}
                </span>
              </div>

              {submission.content && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-charcoal/80 max-h-32 overflow-y-auto">
                  {submission.content}
                </div>
              )}

              {submission.submittedAt && (
                <p className="text-xs text-charcoal/50 mb-4">
                  Submitted: {format(new Date(submission.submittedAt), 'PPp')}
                </p>
              )}

              {gradingId === submission.id ? (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Score (max {assignment.maxPoints})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={assignment.maxPoints}
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback to the student..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGradingId(null)}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleGrade(submission.id)}
                      disabled={isGrading}
                      className="px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isGrading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Grade'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {submission.score !== null && submission.score !== undefined ? (
                    <span className="font-medium text-charcoal">
                      Score: {submission.score} / {assignment.maxPoints}
                    </span>
                  ) : (
                    <span className="text-charcoal/50">Not graded</span>
                  )}
                  <button
                    onClick={() => startGrading(submission)}
                    className="px-4 py-2 text-sm text-evergreen hover:bg-canvas-light rounded-lg transition-colors"
                  >
                    {submission.score !== null && submission.score !== undefined ? 'Edit Grade' : 'Grade'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, UserPlus, Loader2, Check } from 'lucide-react';
import { api } from '@/lib/api/client';
import { User, Course, CourseEnrollment, PaginatedResponse } from '@/types';
import { cn } from '@/lib/utils';

export default function EnrollStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [courseRes, studentsRes, enrollmentsRes] = await Promise.all([
        api.get<Course>(`/courses/${courseId}`),
        api.get<PaginatedResponse<User>>('/users?role=STUDENT&limit=100'),
        api.get<CourseEnrollment[]>(`/courses/${courseId}/enrollments`),
      ]);

      if (courseRes.data) setCourse(courseRes.data);
      if (studentsRes.data) setStudents(studentsRes.data.data);
      if (enrollmentsRes.data) {
        setEnrolledIds(new Set(enrollmentsRes.data.map(e => e.studentId)));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const handleEnroll = async () => {
    if (selectedIds.size === 0) return;

    setIsEnrolling(true);
    try {
      // Enroll each selected student
      await Promise.all(
        Array.from(selectedIds).map(studentId =>
          api.post(`/courses/${courseId}/enroll`, { studentId })
        )
      );

      router.push(`/courses/${courseId}`);
    } catch (error) {
      console.error('Failed to enroll students:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableStudents = filteredStudents.filter(s => !enrolledIds.has(s.id));

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/courses/${courseId}`}
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-charcoal" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-evergreen">Enroll Students</h1>
          <p className="text-charcoal/70 mt-1">
            Add students to <span className="font-medium">{course?.title}</span>
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
        />
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {availableStudents.length === 0 ? (
          <div className="p-8 text-center text-charcoal/60">
            {searchQuery
              ? 'No matching students found'
              : 'All students are already enrolled in this course'}
          </div>
        ) : (
          availableStudents.map((student) => {
            const isSelected = selectedIds.has(student.id);

            return (
              <button
                key={student.id}
                onClick={() => toggleStudent(student.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 text-left transition-colors',
                  isSelected ? 'bg-canvas-light' : 'hover:bg-gray-50'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors',
                  isSelected
                    ? 'bg-evergreen border-evergreen'
                    : 'border-gray-300'
                )}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>

                <div className="w-10 h-10 rounded-full bg-gold-leaf flex items-center justify-center text-evergreen font-semibold">
                  {student.firstName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-charcoal/60 truncate">{student.email}</p>
                </div>

                {student.gradeLevel && (
                  <span className="text-sm text-charcoal/50">
                    Grade {student.gradeLevel}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Already Enrolled Section */}
      {enrolledIds.size > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-charcoal/60 mb-3">
            Already Enrolled ({enrolledIds.size})
          </h3>
          <div className="flex flex-wrap gap-2">
            {filteredStudents
              .filter(s => enrolledIds.has(s.id))
              .map((student) => (
                <span
                  key={student.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-charcoal/70"
                >
                  <span className="w-5 h-5 rounded-full bg-gold-leaf/50 flex items-center justify-center text-evergreen text-xs font-semibold">
                    {student.firstName.charAt(0)}
                  </span>
                  {student.firstName} {student.lastName}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="sticky bottom-4 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
          <p className="text-sm text-charcoal/70">
            {selectedIds.size > 0 ? (
              <>
                <span className="font-semibold text-charcoal">{selectedIds.size}</span> student{selectedIds.size !== 1 ? 's' : ''} selected
              </>
            ) : (
              'Select students to enroll'
            )}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/courses/${courseId}`}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleEnroll}
              disabled={selectedIds.size === 0 || isEnrolling}
              className="px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnrolling ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Enroll Selected
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

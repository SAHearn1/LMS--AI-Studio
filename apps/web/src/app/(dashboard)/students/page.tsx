'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, BookOpen, Award, Mail } from 'lucide-react';
import { api } from '@/lib/api/client';
import { User, CourseEnrollment, PaginatedResponse } from '@/types';
import { cn } from '@/lib/utils';

interface StudentWithEnrollments extends User {
  enrollments?: CourseEnrollment[];
  _count?: {
    enrollments: number;
    submissions: number;
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithEnrollments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PaginatedResponse<StudentWithEnrollments>>('/users?role=STUDENT&limit=100');
      if (response.data) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-evergreen">Students</h1>
        <p className="text-charcoal/70 mt-1">View and manage student enrollments</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
        />
      </div>

      {/* Students Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users className="mx-auto h-12 w-12 text-charcoal/30" />
          <h3 className="mt-4 text-lg font-medium text-charcoal">No students found</h3>
          <p className="mt-2 text-charcoal/60">
            {searchQuery ? 'Try adjusting your search' : 'No students registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}

function StudentCard({ student }: { student: StudentWithEnrollments }) {
  const enrollmentCount = student._count?.enrollments || student.enrollments?.length || 0;
  const submissionCount = student._count?.submissions || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gold-leaf flex items-center justify-center text-evergreen font-semibold text-lg">
          {student.firstName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-charcoal truncate">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-charcoal/60 truncate flex items-center gap-1">
            <Mail size={14} />
            {student.email}
          </p>
          {student.gradeLevel && (
            <p className="text-sm text-charcoal/50">Grade {student.gradeLevel}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-charcoal/60">
        <span className="flex items-center gap-1.5">
          <BookOpen size={16} className="text-leaf" />
          {enrollmentCount} courses
        </span>
        <span className="flex items-center gap-1.5">
          <Award size={16} className="text-gold-leaf" />
          {submissionCount} submissions
        </span>
      </div>

      {/* Active indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className={cn(
          'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full',
          student.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        )}>
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            student.isActive ? 'bg-green-500' : 'bg-gray-400'
          )} />
          {student.isActive ? 'Active' : 'Inactive'}
        </span>
        <Link
          href={`/students/${student.id}`}
          className="text-sm text-leaf hover:text-evergreen transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}

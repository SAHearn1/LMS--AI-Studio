'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Calendar, Award, Clock } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Assignment, PaginatedResponse, AssignmentStatus } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export default function AssignmentsPage() {
  const { user } = useUserStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'ALL'>('ALL');

  const canCreate = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchAssignments();
  }, [statusFilter]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }

      const response = await api.get<PaginatedResponse<Assignment>>(`/assignments?${params}`);
      if (response.data) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDueDateDisplay = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return { text: 'Overdue', className: 'text-red-600 bg-red-50' };
    }
    if (isToday(date)) {
      return { text: 'Due Today', className: 'text-orange-600 bg-orange-50' };
    }
    if (isTomorrow(date)) {
      return { text: 'Due Tomorrow', className: 'text-yellow-600 bg-yellow-50' };
    }
    return { 
      text: `Due ${formatDistanceToNow(date, { addSuffix: true })}`, 
      className: 'text-charcoal/60 bg-gray-50' 
    };
  };

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
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
          <h1 className="font-display text-3xl font-bold text-evergreen">Assignments</h1>
          <p className="text-charcoal/70 mt-1">
            {canCreate ? 'Create and manage assignments' : 'View and submit assignments'}
          </p>
        </div>
        {canCreate && (
          <Link
            href="/assignments/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-evergreen text-gold-leaf rounded-lg hover:bg-deep-canopy transition-colors font-medium"
          >
            <Plus size={20} />
            New Assignment
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | 'ALL')}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-leaf focus:border-transparent bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Assignments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-charcoal/30" />
          <h3 className="mt-4 text-lg font-medium text-charcoal">No assignments found</h3>
          <p className="mt-2 text-charcoal/60">
            {searchQuery ? 'Try adjusting your search' : 'No assignments available'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const dueInfo = getDueDateDisplay(assignment.dueDate);
            
            return (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-charcoal truncate">
                        {assignment.title}
                      </h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(assignment.status))}>
                        {assignment.status}
                      </span>
                    </div>
                    
                    {assignment.description && (
                      <p className="text-charcoal/70 text-sm line-clamp-2 mb-3">
                        {assignment.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-charcoal/60">
                        <Award size={16} className="text-gold-leaf" />
                        {assignment.maxPoints} points
                      </span>
                      
                      {assignment.dueDate && (
                        <span className="flex items-center gap-1.5 text-charcoal/60">
                          <Calendar size={16} />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      )}

                      {assignment._count?.submissions !== undefined && (
                        <span className="flex items-center gap-1.5 text-charcoal/60">
                          <FileText size={16} />
                          {assignment._count.submissions} submissions
                        </span>
                      )}
                    </div>
                  </div>

                  {dueInfo && (
                    <span className={cn('px-3 py-1.5 rounded-lg text-sm font-medium shrink-0', dueInfo.className)}>
                      {dueInfo.text}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

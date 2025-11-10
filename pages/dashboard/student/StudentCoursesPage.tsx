import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Navigation from '../../../components/common/Navigation';
import Loading from '../../../components/common/Loading';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  nextLesson: string;
  dueDate?: string;
}

// Mock API call - replace with actual API
const fetchStudentCourses = async (): Promise<Course[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', title: 'Introduction to Mathematics', instructor: 'Dr. Smith', progress: 45, nextLesson: 'Chapter 5: Algebra', dueDate: '2024-12-15' },
    { id: '2', title: 'World History', instructor: 'Prof. Johnson', progress: 70, nextLesson: 'The Industrial Revolution' },
    { id: '3', title: 'English Literature', instructor: 'Ms. Davis', progress: 30, nextLesson: 'Shakespeare Analysis', dueDate: '2024-12-10' },
  ];
};

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-8 bg-red-50 rounded-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load courses</h2>
      <p className="text-gray-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  </div>
);

const StudentCoursesPage: React.FC = () => {
  const { data: courses, isLoading, isError, error } = useQuery({
    queryKey: ['studentCourses'],
    queryFn: fetchStudentCourses,
  });

  if (isLoading) {
    return <Loading message="Loading your courses..." />;
  }

  if (isError) {
    throw error;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50">
        <Navigation role="student" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-2 text-gray-600">Continue your learning journey</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses?.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                    </div>
                    {course.dueDate && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                        Due {new Date(course.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Your Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-md p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">Next Lesson</p>
                    <p className="text-sm font-medium text-gray-900">{course.nextLesson}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium">
                      Continue Learning
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses?.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses enrolled</h3>
              <p className="mt-1 text-sm text-gray-500">Browse available courses to get started.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudentCoursesPage;

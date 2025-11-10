import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Navigation from '../../../components/common/Navigation';
import Loading from '../../../components/common/Loading';

interface Child {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

interface ChildProgress {
  childId: string;
  courseName: string;
  progress: number;
  grade: string;
  lastActivity: string;
}

interface ParentOverviewData {
  children: Child[];
  recentProgress: ChildProgress[];
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    childName: string;
  }>;
}

// Mock API call - replace with actual API
const fetchParentOverview = async (): Promise<ParentOverviewData> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    children: [
      { id: '1', name: 'Emma Johnson', grade: '5th Grade' },
      { id: '2', name: 'Lucas Johnson', grade: '8th Grade' },
    ],
    recentProgress: [
      { childId: '1', courseName: 'Mathematics', progress: 85, grade: 'A', lastActivity: '2 hours ago' },
      { childId: '1', courseName: 'Science', progress: 72, grade: 'B+', lastActivity: '1 day ago' },
      { childId: '2', courseName: 'History', progress: 90, grade: 'A', lastActivity: '3 hours ago' },
      { childId: '2', courseName: 'English', progress: 78, grade: 'B', lastActivity: '5 hours ago' },
    ],
    upcomingEvents: [
      { id: '1', title: 'Math Quiz', date: '2024-12-15', childName: 'Emma Johnson' },
      { id: '2', title: 'Science Project Due', date: '2024-12-18', childName: 'Emma Johnson' },
      { id: '3', title: 'History Presentation', date: '2024-12-20', childName: 'Lucas Johnson' },
    ],
  };
};

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-8 bg-red-50 rounded-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load overview</h2>
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

const ParentOverviewPage: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['parentOverview'],
    queryFn: fetchParentOverview,
  });

  if (isLoading) {
    return <Loading message="Loading overview..." />;
  }

  if (isError) {
    throw error;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50">
        <Navigation role="parent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Parent Overview</h1>
            <p className="mt-2 text-gray-600">Monitor your children's academic progress</p>
          </div>

          {/* Children Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Children</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.children.map((child) => (
                <div key={child.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-lg">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                      <p className="text-sm text-gray-500">{child.grade}</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Progress */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Progress</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {data?.recentProgress.map((progress, index) => {
                    const child = data.children.find(c => c.id === progress.childId);
                    return (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{progress.courseName}</p>
                            <p className="text-sm text-gray-500">{child?.name}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            progress.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                            progress.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {progress.grade}
                          </span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{progress.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Last activity: {progress.lastActivity}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {data?.upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex flex-col items-center justify-center">
                            <span className="text-xs text-orange-600 font-semibold">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-lg font-bold text-orange-600">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.childName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ParentOverviewPage;

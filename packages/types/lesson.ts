export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  duration?: number; // in minutes
  type: 'video' | 'text' | 'quiz' | 'assignment';
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  id: string;
  lessonId: string;
  studentId: string;
  completed: boolean;
  score?: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
}

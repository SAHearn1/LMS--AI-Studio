// User types
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PARENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  gradeLevel?: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Course types
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructorId: string;
  instructor?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  curriculumId?: string;
  curriculum?: Pick<Curriculum, 'id' | 'title'>;
  duration?: number;
  status: CourseStatus;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  assignments?: Assignment[];
  _count?: {
    lessons: number;
    assignments: number;
    enrollments: number;
  };
}

export interface CourseFormData {
  title: string;
  description?: string;
  instructorId?: string;
  curriculumId?: string;
  duration?: number;
  status?: CourseStatus;
  thumbnail?: string;
}

// Curriculum types
export type CurriculumStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Curriculum {
  id: string;
  title: string;
  description?: string;
  gradeLevel: string;
  subject: string;
  status: CurriculumStatus;
  createdAt: string;
  updatedAt: string;
}

// Lesson types
export type LessonStatus = 'DRAFT' | 'PUBLISHED';
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'INTERACTIVE';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  orderIndex: number;
  duration?: number;
  type: LessonType;
  status: LessonStatus;
  videoUrl?: string;
  resources?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonFormData {
  courseId: string;
  title: string;
  content?: string;
  orderIndex?: number;
  duration?: number;
  type?: LessonType;
  status?: LessonStatus;
  videoUrl?: string;
  resources?: unknown[];
}

export interface LessonProgress {
  id: string;
  lessonId: string;
  studentId: string;
  completed: boolean;
  score?: number;
  timeSpent?: number;
  startedAt: string;
  completedAt?: string;
}

// Enrollment types
export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course?: Course;
  student?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
}

// Assignment types
export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'RETURNED';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxPoints: number;
  status: AssignmentStatus;
  rubric?: unknown;
  attachments?: unknown[];
  createdAt: string;
  updatedAt: string;
  course?: Course;
  submissions?: AssignmentSubmission[];
  _count?: {
    submissions: number;
  };
}

export interface AssignmentFormData {
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxPoints?: number;
  status?: AssignmentStatus;
  rubric?: unknown;
  attachments?: unknown[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  attachments?: unknown[];
  score?: number;
  feedback?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignment?: Assignment;
  student?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
}

export interface SubmissionFormData {
  assignmentId: string;
  content?: string;
  attachments?: unknown[];
}

export interface GradeFormData {
  score: number;
  feedback?: string;
}

// Progress Dashboard types
export interface StudentProgress {
  courseId: string;
  courseTitle: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  averageScore?: number;
}

export interface DashboardStats {
  totalCourses: number;
  enrolledStudents: number;
  activeLessons: number;
  pendingAssignments: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// AI Generation types
export interface AILessonGenerationRequest {
  topic: string;
  gradeLevel?: string;
  learningObjectives?: string[];
  duration?: number;
  type?: LessonType;
}

export interface AIGeneratedLesson {
  title: string;
  content: string;
  objectives: string[];
  activities: string[];
  assessmentIdeas: string[];
}

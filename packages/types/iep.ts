export interface IEP {
  id: string;
  studentId: string;
  title: string;
  description: string;
  goals: IEPGoal[];
  accommodations: string[];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IEPGoal {
  id: string;
  iepId: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  notes?: string;
}

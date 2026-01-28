import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [CoursesModule, LessonsModule, AssignmentsModule],
  exports: [CoursesModule, LessonsModule, AssignmentsModule],
})
export class LearningModule {}

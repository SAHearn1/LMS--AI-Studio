import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { CoursesModule } from './modules/learning/courses/courses.module';
import { LessonsModule } from './modules/learning/lessons/lessons.module';
import { AssignmentsModule } from './modules/learning/assignments/assignments.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { GardenModule } from './modules/garden/garden.module';

@Module({
  imports: [
    UsersModule,
    CurriculumModule,
    CoursesModule,
    LessonsModule,
    AssignmentsModule,
    ComplianceModule,
    GardenModule,
  ],
})
export class AppModule {}

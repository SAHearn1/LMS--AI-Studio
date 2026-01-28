import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CurriculumController, CoursesController],
  providers: [CurriculumService, CoursesService],
  exports: [CurriculumService, CoursesService],
})
export class CurriculumModule {}

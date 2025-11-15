import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { LessonGeneratorService } from './services/lesson-generator.service';
import { TutorBotService } from './services/tutor-bot.service';
import { CrisisDetectionService } from './services/crisis-detection.service';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [
    AiService,
    LessonGeneratorService,
    TutorBotService,
    CrisisDetectionService,
  ],
  exports: [AiService],
})
export class AiModule {}

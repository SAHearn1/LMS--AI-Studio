import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { LearningModule } from './modules/learning/learning.module';
import { AiModule } from './modules/ai/ai.module';
import { GardenModule } from './modules/garden/garden.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
    }),
    AuthModule,
    UsersModule,
    CurriculumModule,
    LearningModule,
    AiModule,
    GardenModule,
    ComplianceModule,
    AnalyticsModule,
    CommunicationsModule,
    IntegrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

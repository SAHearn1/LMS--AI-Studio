import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}

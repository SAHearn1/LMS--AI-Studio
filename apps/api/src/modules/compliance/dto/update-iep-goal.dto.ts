import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateIEPGoalDto } from './create-iep-goal.dto';

export class UpdateIEPGoalDto extends PartialType(
  OmitType(CreateIEPGoalDto, ['iepId'] as const),
) {}

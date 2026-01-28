import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateIEPDto } from './create-iep.dto';

export class UpdateIEPDto extends PartialType(
  OmitType(CreateIEPDto, ['studentId'] as const),
) {}

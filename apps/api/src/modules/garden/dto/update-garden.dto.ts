import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateGardenDto } from './create-garden.dto';

export class UpdateGardenDto extends PartialType(
  OmitType(CreateGardenDto, ['studentId'] as const),
) {}

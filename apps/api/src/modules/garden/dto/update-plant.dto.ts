import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePlantDto } from './create-plant.dto';

export class UpdatePlantDto extends PartialType(
  OmitType(CreatePlantDto, ['gardenId'] as const),
) {}

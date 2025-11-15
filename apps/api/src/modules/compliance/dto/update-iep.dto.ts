import { PartialType } from '@nestjs/swagger';
import { CreateIEPDto } from './create-iep.dto';

export class UpdateIEPDto extends PartialType(CreateIEPDto) {}

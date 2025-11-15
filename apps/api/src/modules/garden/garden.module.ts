import { Module } from '@nestjs/common';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';

@Module({
  imports: [],
  controllers: [GardenController],
  providers: [GardenService],
  exports: [GardenService],
})
export class GardenModule {}

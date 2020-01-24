import { Module } from '@nestjs/common';
import { SeasonsController } from './seasons.controller';

@Module({
  controllers: [SeasonsController]
})
export class SeasonsModule {}

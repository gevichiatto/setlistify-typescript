import { Module } from '@nestjs/common';
import { FestprepController } from './festprep.controller';
import { FestprepService } from './festprep.service';

@Module({
  controllers: [FestprepController],
  providers: [FestprepService],
})
export class FestprepModule {}

import { Module } from '@nestjs/common';
import { SetlistModule } from './setlist/setlist.module';
import { FestprepModule } from './festprep/festprep.module';

@Module({
  imports: [SetlistModule, FestprepModule],
})
export class ApiModule {}

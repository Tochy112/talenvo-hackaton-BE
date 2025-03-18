import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from './entities/rank.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Rank]),
    ],
  controllers: [RankController],
  providers: [RankService],
})
export class RankModule {}

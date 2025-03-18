import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rank } from './entities/rank.entity';
import { CreateRankDto } from './dto/create-rank.dto';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(Rank)
    private readonly rankRepository: Repository<Rank>,
  ) {}

  async create(rankData: CreateRankDto): Promise<Rank> {
    const existingRank = await this.rankRepository.findOne({ where: { name: rankData.name } });
    if (existingRank) {
      throw new BadRequestException('Rank name must be unique');
    }

    const overlappingRank = await this.rankRepository
      .createQueryBuilder('rank')
      .where(':minXp BETWEEN rank.minXp AND rank.maxXp OR :maxXp BETWEEN rank.minXp AND rank.maxXp', {
        minXp: rankData.minXp,
        maxXp: rankData.maxXp,
      })
      .getOne();
    
    if (overlappingRank) {
      throw new BadRequestException('XP range overlaps with an existing rank');
    }

    const rank = this.rankRepository.create(rankData);
    return this.rankRepository.save(rank);
  }

  async findAll(): Promise<Rank[]> {
    return this.rankRepository.find();
  }

  async findOne(id: string): Promise<Rank> {
    const rank = await this.rankRepository.findOne({ where: { id } });
    if (!rank) {
      throw new NotFoundException('Rank not found');
    }
    return rank;
  }

  async update(id: string, updateData: Partial<Rank>): Promise<Rank> {
    await this.rankRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.rankRepository.softDelete(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RankService } from './rank.service';
import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GlobalApiResponse } from 'utils/decorator/api-response.decorator';

@GlobalApiResponse()
@Controller({
  path: 'rank',
  version: '1'
})
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rank' })
  async create(@Body() rankData: CreateRankDto) {
    return await this.rankService.create(rankData);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all ranks' })
  async findAll() {
    return await this.rankService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single rank' })
  async findOne(@Param('id') id: string) {
    return await this.rankService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rank' })
  async update(@Param('id') id: string, @Body() updateData: UpdateRankDto) {
    return await this.rankService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rank' })
  async remove(@Param('id') id: string) {
    return await this.rankService.remove(id);
  }
}

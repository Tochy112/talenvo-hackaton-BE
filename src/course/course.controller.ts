import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/customDecorators/roleHandling';
import { GlobalApiResponse } from 'utils/decorator/api-response.decorator';
@GlobalApiResponse()
@Controller({
  path: 'course',
  version: '1',
})
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post(':teacherId')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('teacher')
  @ApiOperation({ summary: 'create a course' })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Param('teacherId') teacherId: string,
  ) {
    console.log("hello world1");
    
    const data = await this.courseService.create(createCourseDto, teacherId);
    return {
      data,
      status: 'success',
    };
  }

  @Get('')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  // @ApiQuery({
  //   name: 'role',
  //   required: false,
  //   type: String,
  //   description: 'Account role',
  // })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    // @Query('role') role?: string,
  ) {
    const data = await this.courseService.findAll({
      page,
      limit,
      search,
      // role,
    });
    return {
      status: 'success',
      ...data,
    };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get single course by id' })
  async findOneById(@Param('id') id: string, @Query() queryParams) {
    const course = await this.courseService.findOne(id);
    return {
      data: course,
      status: 'success',
    };
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('teacher')
  @ApiOperation({ summary: 'Update course data' })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('teacher')
  @ApiOperation({ summary: 'Delete a course' })
  async remove(@Param('id') id: string) {
    const data = await this.courseService.remove(id);
    return {
      data,
      status: 'success',
    };
  }
}

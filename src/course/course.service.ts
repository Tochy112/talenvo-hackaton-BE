import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'utils/pagination.utils';
import { Course } from './entities/course.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private authService: AuthService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    if (!createCourseDto.title) {
      throw new BadRequestException('Provide name');
    }
    const course = await this.courseRepository.findOne({
      where: { title: createCourseDto.title },
    });

    if (course) {
      throw new ConflictException(
        `course with title ${course.title} already exists`,
      );
    }

    createCourseDto.account = await this.authService.getUserFromRequest();

    const newCourse = this.courseRepository.create(createCourseDto);
    const newCourseData = await this.courseRepository.save(newCourse);
    return newCourseData;
  }

  async findAll({
    page,
    limit,
    search,
  }: {
    page?: number | 1;
    limit?: number | 10;
    search?: string;
  }) {
    const query = this.courseRepository.createQueryBuilder('course');

    if (search) {
      query.andWhere(
        '(course.title LIKE :search OR course.subject LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data] = await query.getManyAndCount();

    return {
      ...paginate(data, limit, page),
    };
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    Object.assign(course, { ...updateCourseDto });
    await this.courseRepository.save(course);
    return course;
  }

  async remove(id: string) {
    const role = await this.courseRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    await this.courseRepository.softDelete(id);
    return { message: 'Course deleted successfully' };
  }

  async restore(id: string) {
    const role = await this.courseRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!role) {
      throw new BadRequestException('Course not found');
    }

    await this.courseRepository.recover(role);
    return { message: 'Course restored successfully' };
  }
}

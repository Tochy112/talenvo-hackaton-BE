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
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entities/account.entity';
import { QuizAttempt } from 'src/quiz-attempt/entities/quizAttempt.entity';
import { Question } from 'src/question/entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private authService: AuthService,
  ) {}

  async create(createCourseDto: CreateCourseDto, teacherId: string) {    
    console.log("hello world");
    
    const account = await this.accountRepository.findOne({
      where: {id: teacherId}
    })

    if (!createCourseDto.title) {
      throw new BadRequestException('Provide title');
    }
    const course = await this.courseRepository.findOne({
      where: { title: createCourseDto.title },
    });

    if (course) {
      throw new ConflictException(
        `course with title ${course.title} already exists`,
      );
    }

    const newCourse = this.courseRepository.create({
      ...createCourseDto, 
      account
    }
    );
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
      relations: ["quizzes", "quizzes.questions"]
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
    const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['quizzes', 'quizzes.questions', 'quizzes.attempts'],
    });

    if (!course) {
        throw new BadRequestException('Course not found');
    }

    // Delete related quiz attempts
    for (const quiz of course.quizzes) {
        await this.quizAttemptRepository.delete({ quiz: { id: quiz.id } });
    }

    // Delete related questions
    for (const quiz of course.quizzes) {
        await this.questionRepository.delete({ quiz: { id: quiz.id } });
    }

    // Delete related quizzes
    await this.quizRepository.delete({ course: { id } });

    // Delete the course
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

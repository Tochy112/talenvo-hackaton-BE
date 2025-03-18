import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { GlobalApiResponse } from 'utils/decorator/api-response.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { Roles } from 'src/auth/customDecorators/roleHandling';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@GlobalApiResponse()
@Controller({
  path: 'quiz',
  version: '1',
})
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post(':courseId')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a quiz' })
  @Roles('teacher')
  async createQuiz(
    @Param('courseId') courseId: string,
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return await this.quizService.createQuiz(courseId, createQuizDto);
  }

  @Get(':quizId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Fetch quiz by id' })
  async getQuiz(@Param('quizId') quizId: string) {
    return await this.quizService.getQuiz(quizId);
  }

  @Patch(':quizId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update quiz by id' })
  async updateQuiz(
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return await this.quizService.updateQuiz(quizId, updateQuizDto);
  }

  @Post('submit/:quizId/:userId')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Submit quiz' })
  @Roles('user')
  async submitQuizAttempt(
    @Param('quizId') quizId: string,
    @Param('userId') userId: string,
    @Body() answers: SubmitQuizDto,
  ) {
    return await this.quizService.submitQuizAttempt(userId, quizId, answers);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guard/jwt.guard';
import { GetUser } from './customDecorators/getUser';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateAccountDto } from 'src/auth/dto/create-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GlobalApiResponse } from '../../utils/decorator/api-response.decorator';

@GlobalApiResponse()
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register an account' })
  async registerAdmin(@Body() dto: CreateAccountDto) {
    const data = await this.authService.create(dto);
    return {
      data,
      status: 'success',
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Log into an account' })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      data,
      status: 'success',
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request reset link to be sent to verified email' })
  async requestPasswordReset(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(forgotPasswordDto);
    return {
      data,
      status: 'success',
    };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get Currently logged in User' })
  async getMe(@GetUser() user: any) {
    const { deletedAt, ...userWithoutDeletedAt } = user;
    return { data: userWithoutDeletedAt, status: 'success' };
  }

  @Patch('reset-password')
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Password reset token',
  })
  @ApiOperation({ summary: 'Reset Password of a particular account' })
  async resetPassword(
    @Query() queryParams,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    if (queryParams.token) {
      resetPasswordDto.token = queryParams.token;
    }
    const data = await this.authService.resetPassword(resetPasswordDto);
    return {
      data,
      status: 'success',
    };
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {}

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req, @Res() res) {
  //   const jwt = await this.authService.generateJwtToken(req.user);
  //   res.redirect(`${process.env.FRONTEND_URL}?token=${jwt}`);
  // }

  // @Post('verify')
  // @ApiOperation({ summary: 'Verify email token' })
  // async verifyEmail(
  //   @Body() dto: VerifyEmailDto,
  //   @Query('email') email: string,
  // ) {
  //   await this.userService.verifyEmailToken(dto, email);
  //   return { message: 'Email verified successfully' };
  // }
}

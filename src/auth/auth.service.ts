import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Account } from '../account/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import { MoreThan, Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { MailService } from 'src/mail/mail.service';
import { Role } from 'src/role/entities/role.entity';
import { EmailValidationException } from 'utils';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly accountService: AccountService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateAccountDto) {
    // Validate email
    if (!validateEmail(createUserDto.email)) {
      throw new EmailValidationException();
    } else if (!createUserDto.email) {
      return 'Email is required';
    }

    // Check if email is already in use
    const existingEmail = await this.accountRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });
    if (existingEmail) {
      if (existingEmail.deletedAt != null) {
        throw new ConflictException(
          `Email ${createUserDto.email} belonged to a deleted account`,
        );
      } else {
        throw new ConflictException(
          `Email ${createUserDto.email} is already in use`,
        );
      }
    }

    const existingRole = await this.roleRepository.findOne({
      where: { name: createUserDto.role.name },
    });

    if (!existingRole) {
      throw new BadRequestException(`Role does not exist`);
    }

    createUserDto.role = existingRole;

    // Hash password
    await hash(createUserDto.password, 10);

    // const token = Math.floor(100000 + Math.random() * 900000).toString();

    // createUserDto.verificationToken = token;

    // saving user to database
    const account = this.accountRepository.create(createUserDto);
    const newAcccount = await this.accountRepository.save(account);

    if (newAcccount) {
      // Sending  email to user after signing up      
      await this.mailService.sendAuthEmailConfirmation(
        createUserDto,
        true,
      );
    }

    return {
      id: newAcccount.id,
      firstName: newAcccount.firstName,
      lastName: newAcccount.lastName,
      email: newAcccount.email,
      phoneNumber: newAcccount.phoneNumber,
      role: newAcccount.role,
    };
  }

  async login(dto: LoginDto) {
    const account = await this.validateUser(dto);

    const payload = {
      email: account.email,
      sub: account.id,
    };

    await this.accountService.updateLastLogin(account.id);

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.jwtSecretKey,
    });

    return { account, access_token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const account = await this.accountRepository.findOne({ where: { email } });
    if (!account) {
      throw new NotFoundException(`account with email ${email} not found`);
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    account.resetToken = resetToken;
    account.resetTokenExpiry = resetTokenExpiry;

    await this.accountRepository.save(account);

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await this.mailService.sendPasswordResetEmail(account.email, resetUrl);
    return { message: 'Reset link sent to verified email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const account = await this.accountRepository.findOne({
      where: { resetToken: token, resetTokenExpiry: MoreThan(new Date()) },
    });

    console.log('account:', account);

    if (!account) {
      throw new ConflictException('Invalid or expired token');
    }

    account.password = await hash(newPassword, 10);
    account.resetToken = null;
    account.resetTokenExpiry = null;
    await this.accountRepository.save(account);

    return { message: 'Password reset successfully' };
  }

  async findUserWithEmail(email: string): Promise<Account> {
    return this.accountRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        password: true,
      },
      relations: ['role'],
    });
  }

  async validateUser(dto: LoginDto) {
    const account = await this.findUserWithEmail(dto.email);

    if (!account) {
      throw new ConflictException(`Account does not exist`);
    }

    // Check if the user's email is verified
    // if (!user.isVerified) {
    //   throw new UnauthorizedException(
    //     'Email is unverified. Please check your email for a verification token',
    //   );
    // }

    // Validate the password

    const isPasswordValid = await compare(dto.password, account.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Exclude the password field from the result
    const { password, ...result } = account;
    return result;
  }

  
  async generateJwtToken(user: Account) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.jwtSecretKey,
    });
  }



  // async verifyEmailToken(
  //   verifyEmailDto: VerifyEmailDto,
  //   email: string,
  // ): Promise<User> {
  //   const user = await this.accountRepository.findOne({
  //     where: {
  //       verificationToken: verifyEmailDto.verificationToken,
  //       email: email,
  //     },
  //   });

  //   if (!user) {
  //     throw new BadRequestException('Invalid or expired verification token');
  //   }
  //   if (user) {
  //     user.isVerified = true;
  //     user.verificationToken = null;
  //     const savedUser = await this.accountRepository.save(user);
  //     if (savedUser) {
  //       await this.mailService.sendPasswordAfterVerifyingEmail(
  //         email,
  //         user,
  //         true,
  //       );
  //     }
  //   }
  //   return;
  // }
}

function validateEmail(email: string) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

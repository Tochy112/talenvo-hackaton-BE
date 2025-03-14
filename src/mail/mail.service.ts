import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../auth/dto/create-account.dto';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAuthEmailConfirmation(
    user: CreateAccountDto,
    password: string,
    isWelcomeEmail: boolean,
  ) {
    if (!user) {
      return;
    }

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Thank You for signing up',
      template: './confirmation',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        password: password,
        support: 'lunozart@support.com',
        sendUserWelcome: isWelcomeEmail,
      },
    });
  }

  // async sendPasswordAfterVerifyingEmail(
  //   email: string,
  //   user: User,
  //   isVerified: boolean,
  // ) {
  //   const mailOptions = {
  //     to: email,
  //     subject: 'Email Verified',
  //     template: './confirmation',
  //     context: {
  //       role: user.role,
  //       password: user.password,
  //       email: email,
  //       sendVerificationMail: isVerified,
  //     },
  //   };

  //   await this.mailerService.sendMail(mailOptions);
  // }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      template: './confirmation',
      context: {
        resetUrl: resetUrl,
        email: email,
      },
    };

    await this.mailerService.sendMail(mailOptions);
  }
}

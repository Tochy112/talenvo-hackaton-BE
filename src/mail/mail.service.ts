import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../auth/dto/create-account.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAuthEmailConfirmation(
    user: CreateAccountDto,
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
        support: 'team@support.com',
        sendUserWelcome: isWelcomeEmail,
      },
    });
  }


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

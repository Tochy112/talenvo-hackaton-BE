import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { MailModule } from '../mail/mail.module';
import { Role } from 'src/role/entities/role.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryUpload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Role]),
    MailModule,
    CloudinaryModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtService],
  exports: [AccountService],
})
export class AccountModule {}

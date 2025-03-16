import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountService } from '../account/account.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { Account } from '../account/entities/account.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryUpload.module';
import { Role } from 'src/role/entities/role.entity';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Role]),
    AccountModule,
    CloudinaryModule,
    JwtModule.register({
      secret: process.env.jwtSecretKey,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from '../../account/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.jwtSecretKey,
    });
  }
  async validate(payload: any) {
    const { sub: userId } = payload;

    const user = await this.userRepository.findOne({ where: { id: userId }, 
    relations: ["role"]
    });    
    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, resetToken, resetTokenExpiry, ...userData } = user;
    return userData;
  }
}

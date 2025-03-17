import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Like, Repository } from 'typeorm';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { Role } from 'src/role/entities/role.entity';
import { QueryRoleDto } from './dto/query-role.dto';
import { UpdateRoleDto } from 'src/role/dto/update-role.dto';
import { UpdateAccountRoleDTO } from './dto/update-account-role.dto';
import { Readable } from 'stream';
import { paginate } from 'utils/pagination.utils';
import { CloudinaryUploadService } from 'src/cloudinary/cloudinaryUpload.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly cloudinaryUploadService: CloudinaryUploadService,
  ) {}

  // async findAll({
  //   page,
  //   limit,
  //   search,
  //   role,
  // }: {
  //   page?: number | 1;
  //   limit?: number | 10;
  //   search?: string;
  //   role?: string;
  // }) {
  //   const query = this.accountRepository
  //     .createQueryBuilder('account')
  //     .leftJoinAndSelect('account.role', 'role')
  //     .orderBy('account.createdAt', 'DESC');

  //   if (search) {
  //     query.andWhere(
  //       '(account.firstName LIKE :search OR account.lastName LIKE :search OR account.email LIKE :search)',
  //       { search: `%${search}%` },
  //     );
  //   }

  //   if (role) {
  //     query.andWhere('role.name = :role', { role });
  //   }

  //   const [data] = await query.getManyAndCount();

  //   return {
  //     ...paginate(data, limit, page),
  //   };
  // }
  

  async findOneById(id: string): Promise<Account> {
    const user = await this.accountRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  async updateLastLogin(userId: string): Promise<void> {
    await this.accountRepository.update(userId, { lastLogin: new Date() });
  }

  async updatePassword(updatePasswordDTO: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDTO;

    const user = await this.accountRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Ensure currentPassword and user.password are defined
    if (!currentPassword || !user.password) {
      throw new BadRequestException('Current password is required');
    }

    // Compare currentPassword with the stored hashed password
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Validate new password strength (optional)
    if (newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least 8 characters long',
      );
    }

    // Hash the new password and update the user's password
    user.password = await hash(newPassword, 10);
    await this.accountRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.accountRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);

    const updatedUser = await this.accountRepository.save(user);
    const { password, deletedAt, ...data } = updatedUser;

    return {
      data,
      status: 'success',
    };
  }

  async deleteAccount(id: string) {
    const user = await this.accountRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new ConflictException(`User with id ${id} does not exist`);
    }
    
    await this.accountRepository.softDelete(id);
    return { message: `Account deleted successfully` };
  }

  async restoreAccount(id: string) {
    const user = await this.accountRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) {
      throw new ConflictException(`User with id ${id} does not exist`);
    }

    await this.accountRepository.recover(user);
    return { message: `Account restored successfully` };
  }
}

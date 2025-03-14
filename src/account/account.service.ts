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

  async findAll({
    page,
    limit,
    search,
    role,
  }: {
    page?: number | 1;
    limit?: number | 10;
    search?: string;
    role?: string;
  }) {
    const query = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.role', 'role')
      .orderBy('account.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(account.firstName LIKE :search OR account.lastName LIKE :search OR account.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      query.andWhere('role.name = :role', { role });
    }

    const [data] = await query.getManyAndCount();

    return {
      ...paginate(data, limit, page),
    };
  }

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

  async findSingleAccountByRole(
    id: string,
    role: QueryRoleDto,
  ): Promise<Account> {
    const user = await this.accountRepository.findOne({
      where: { id, role: { name: role.roleName } },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`Account not found`);
    }
    return user;
  }

  async findAccountsByRole(): Promise<{
    data: { [key: string]: Account[]; total: any }[];
  }> {
    const accounts = await this.accountRepository.find({
      relations: ['role'],
    });

    const groupedAccounts = accounts.reduce((acc, account) => {
      if (!acc[account.role.name]) {
        acc[account.role.name] = [];
      }
      acc[account.role.name].push(account);
      return acc;
    }, {});

    if (groupedAccounts['staff']) {
      groupedAccounts['staff'].sort((a: any, b: any) => {
        const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return dateB - dateA;
      });
    }

    return {
      data: Object.keys(groupedAccounts).map((role) => ({
        data: groupedAccounts[role],
        total: groupedAccounts[role].length,
        role: groupedAccounts[role][0].role.name,
      })),
    };
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.accountRepository.update(userId, { lastLogin: new Date() });
  }

  async updatePassword(updatePasswordDTO: UpdatePasswordDto) {
    const { currentPassword, newPassword, email } = updatePasswordDTO;

    const user = await this.accountRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
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

    if (updateProfileDto.roleName) {
      const role = await this.roleRepository.findOne({
        where: { name: updateProfileDto.roleName },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      user.role = role;
    }

    Object.assign(user, updateProfileDto);

    const updatedUser = await this.accountRepository.save(user);
    const { password, deletedAt, ...data } = updatedUser;

    return {
      data,
      status: 'success',
    };
  }

  async updateProfileImage(id: string, file: Express.Multer.File) {
    const user = await this.accountRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Delete the existing profile image if it exists
    try {
      if (user.profileImage) {
        const publicId = user.profileImage
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        user.profileImage = null;
      }

      // Upload new profile image using chunked upload
      const profileImageUrl = await this.cloudinaryUploadService.uploadFile(
        file,
        'LunozartUsers',
      );

      // Update the user's profile image URL in the database
      user.profileImage = profileImageUrl;
      await this.accountRepository.save(user);

      return {
        status: 'success',
        profileImage: profileImageUrl,
        message: 'Profile image updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update profile image: ${error.message}`,
      );
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateAccountRoleDTO) {
    const user = await this.accountRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({
      where: {
        name: updateRoleDto.name,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.role = role;
    await this.accountRepository.save(user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      status: user.status,
    };
  }

  async toggleAccountStatus(id: string) {
    const user = await this.accountRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status == 'active') {
      user.status = 'inactive';
    } else {
      user.status = 'active';
    }

    await this.accountRepository.save(user);

    return {
      message: `${user.status == 'active' ? `${user.firstName}'s account activated successfully` : `${user.firstName}'s account deactivated successfully`}`,
    };
  }

  async deleteAccount(id: string) {
    const user = await this.accountRepository.findOne({
      where: { id },
      relations: ['attendance'],
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

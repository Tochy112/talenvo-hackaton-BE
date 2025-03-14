import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { paginate } from 'utils/pagination.utils';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    if (!createRoleDto.name) {
      throw new BadRequestException('Provide name');
    }
    const role = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (role) {
      throw new ConflictException('role already exists');
    }

    const newRole = this.roleRepository.create(createRoleDto);
    const newRoleData = await this.roleRepository.save(newRole);
    return newRoleData;
  }

  async findAll({
    page,
    limit,
    search,
  }: {
    page?: number | 1;
    limit?: number | 10;
    search?: string;
  }) {
    const query = this.roleRepository.createQueryBuilder('role');

    if (search) {
      query.andWhere('(role.name LIKE :search)', { search: `%${search}%` });
    }

    const [data] = await query.getManyAndCount();

    return {
      ...paginate(data, limit, page),
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    Object.assign(role, { ...updateRoleDto });
    await this.roleRepository.save(role);
    return role;
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    await this.roleRepository.softDelete(id);
    return { message: 'Role deleted successfully' };
  }

  async restore(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    await this.roleRepository.recover(role);
    return { message: 'Role restored successfully' };
  }
}

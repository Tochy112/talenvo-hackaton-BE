import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seedRoles() {
    const roles = [
      { name: 'user', description: 'User role' },
      { name: 'teacher', description: 'Teacher role' },
    ];

    for (const role of roles) {
      const existingRole = await this.roleRepository.findOne({ where: { name: role.name } });
      if (!existingRole) {
        const newRole = this.roleRepository.create(role);
        await this.roleRepository.save(newRole);
      }
    }

    console.log('Roles seeded successfully');
  }
}
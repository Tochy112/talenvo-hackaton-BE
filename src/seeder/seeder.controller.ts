import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller({ path: 'seeding', version: '1' })
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  seed() {
    return this.seederService.seedRoles();
  }
}

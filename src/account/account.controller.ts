import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { Roles } from 'src/auth/customDecorators/roleHandling';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { Role } from 'src/role/entities/role.entity';
import { UpdateAccountRoleDTO } from './dto/update-account-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GlobalApiResponse } from '../../utils/decorator/api-response.decorator';

@GlobalApiResponse()
@Controller({ path: 'accounts', version: '1' })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    description: 'Account role',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    const result = await this.accountService.findAll({
      page,
      limit,
      search,
      role,
    });
    return {
      status: 'success',
      ...result,
    };
  }



  @Get('/role')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Get accounts by role' })
  async findAccountsByRole() {
    const account = await this.accountService.findAccountsByRole();
    return {
      data: account,
      status: 'success',
    };
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Get single account by id' })
  async findOneById(@Param('id') id: string, @Query() queryParams) {
    const account = await this.accountService.findOneById(id);
    return {
      data: account,
      status: 'success',
    };
  }

  @Get(':id/role')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiQuery({
    name: 'roleName',
    required: true,
    description: 'role name',
  })
  @ApiOperation({ summary: 'Get an account by role' })
  async findSingleAccountByRole(@Param('id') id: string, @Query() queryParams) {
    const data = await this.accountService.findSingleAccountByRole(
      id,
      queryParams,
    );
    return {
      data,
      status: 'success',
    };
  }

  @Patch('update-password')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email whose password is to be updated',
  })
  @ApiOperation({ summary: 'Update Password of a particular account' })
  async updatePassword(
    @Query() queryParams,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (queryParams.email) {
      updatePasswordDto.email = queryParams.email;
    }

    const data = await this.accountService.updatePassword(updatePasswordDto);
    return {
      data,
      status: 'success',
    };
  }

  @Patch(':id/update-profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update account profile' })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.accountService.updateProfile(id, updateProfileDto);
  }

  @Post(':id/update-profile-image')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({ summary: 'Update profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const data = await this.accountService.updateProfileImage(id, file);
    return {
      data,
      status: 'success',
    };
  }

  @Patch(':id/update-role')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Update account role' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateAccountRoleDTO,
  ) {
    const data = await this.accountService.updateRole(id, updateRoleDto);
    return {
      data,
      status: 'success',
    };
  }

  @Patch(':id/status-toggle')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Deactivate or activate an account' })
  async deactivateUser(@Param('id') id: string) {
    const data = await this.accountService.toggleAccountStatus(id);
    return {
      data,
      status: 'success',
    };
  }

  @Delete(':id/delete')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete an account' })
  async remove(@Param('id') id: string) {
    const data = await this.accountService.deleteAccount(id);
    return {
      data,
      status: 'success',
    };
  }

  @Put(':id/restore')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles('admin')
  @ApiOperation({ summary: 'Restore an account' })
  async restore(@Param('id') id: string) {
    const data = await this.accountService.restoreAccount(id);
    return {
      data,
      status: 'success',
    };
  }
}

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

  // @Get()
  // @UseGuards(JwtGuard, RolesGuard)
  // @ApiBearerAuth('JWT')
  // @Roles('admin')
  // @ApiOperation({ summary: 'Get all accounts' })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  //   description: 'Page number',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  //   description: 'Number of items per page',
  // })
  // @ApiQuery({
  //   name: 'search',
  //   required: false,
  //   type: String,
  //   description: 'Search term',
  // })
  // @ApiQuery({
  //   name: 'role',
  //   required: false,
  //   type: String,
  //   description: 'Account role',
  // })
  // async findAll(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  //   @Query('search') search?: string,
  //   @Query('role') role?: string,
  // ) {
  //   const result = await this.accountService.findAll({
  //     page,
  //     limit,
  //     search,
  //     role,
  //   });
  //   return {
  //     status: 'success',
  //     ...result,
  //   };
  // }


  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get single account by id' })
  async findOneById(@Param('id') id: string, @Query() queryParams) {
    const account = await this.accountService.findOneById(id);
    return {
      data: account,
      status: 'success',
    };
  }

  
  @Patch('update-password')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update Password of a particular account' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const data = await this.accountService.updatePassword(updatePasswordDto);
    return {
      data,
      status: 'success',
    };
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update account profile' })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.accountService.updateProfile(id, updateProfileDto);
  }


  @Delete(':id')
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

  @Put(':id')
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

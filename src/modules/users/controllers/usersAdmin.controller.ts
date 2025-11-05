import {
  Controller,
  Post,
  Put,
  Param,
  Body,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { CreateAdminDto } from '../dtos/createAdmin.dto';
import { UpdateAdminDto } from '../dtos/updateAdmin.dto';
import { AccountType } from '../enums/account-type.enum';
import { FindOneDto } from '../dtos/findOne.dto';
import { FindAllDto } from '../dtos/findAll.dto';

@Controller('admin/users')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(AccountType.ADMIN)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateAdminDto) {
    return await this.usersService.create(body);
  }

  @Get()
  async findAll(@Query() query: FindAllDto) {
    return await this.usersService.findAll(query);
  }

  @Put(':id')
  async update(
    @Param() params: FindOneDto,
    @Body() body: UpdateAdminDto,
    @Req() req: IRequest,
  ) {
    return await this.usersService.update({ ...params, ...body }, req);
  }
}

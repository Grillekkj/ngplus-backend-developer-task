import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AccountType } from '../enums/account-type.enum';
import { UsersService } from '../services/users.service';
import { FindOneDto } from '../dtos/findOne.dto';
import { CreateDto } from '../dtos/create.dto';
import { UpdateDto } from '../dtos/update.dto';
import { RemoveDto } from '../dtos/remove.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateDto) {
    return await this.usersService.create(body);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  async findOne(@Param() params: FindOneDto, @Req() req: IRequest) {
    return await this.usersService.findOne(params, req);
  }

  @Put(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  async update(
    @Param() params: FindOneDto,
    @Body() body: UpdateDto,
    @Req() req: IRequest,
  ) {
    return await this.usersService.update({ ...params, ...body }, req);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  async remove(@Param() params: RemoveDto, @Req() req: IRequest) {
    return await this.usersService.remove(params, req);
  }
}

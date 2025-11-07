import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { AccountType } from 'src/modules/users/enums/account-type.enum';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ReportsService } from '../services/reports.service';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(AccountType.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('pdf')
  async getPdfReport(@Res() res: Response) {
    await this.reportsService.generatePdfReport(res);
  }

  @Get('excel')
  async getExcelReport(@Res() res: Response) {
    await this.reportsService.generateExcelReport(res);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user-role.enum';

@Controller('companies')
// @UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  // @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.companyService.findBySlug(slug);
  }

  @Patch(':id')
  // @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  // @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}

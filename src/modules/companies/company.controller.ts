import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRole } from 'src/core/enums/user-role.enum';
import { JwtPayload } from '../auth/interfaces/auth.interface';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

export interface CreateSimpleCompanyDto {
  name: string;
}

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Post('simple')
  async createSimple(
    @Body() body: CreateSimpleCompanyDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Company> {
    return this.companyService.createSimple(body.name, user.sub);
  }

  @Get()
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Company> {
    return this.companyService.findBySlug(slug);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Patch(':id/colors')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  updateColors(
    @Param('id') id: string,
    @Body() colors: { primaryColor: string; secondaryColor: string },
  ): Promise<Company> {
    return this.companyService.update(id, colors);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.companyService.remove(id);
  }
}

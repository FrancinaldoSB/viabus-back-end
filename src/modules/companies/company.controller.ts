import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../core/enums/user-role.enum';
import {
  ApiResponseBuilder,
  ApiSuccessResponse,
} from '../../core/interfaces/api-response';
import { User } from '../users/entities/user.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyColorsDto } from './dto/update-company-colors.dto';
import { Company } from './entities/company.entity';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);

  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<ApiSuccessResponse<Company>> {
    this.logger.debug('Creating company');

    const company = await this.companyService.create(createCompanyDto);

    return ApiResponseBuilder.success(company, 'Empresa criada com sucesso');
  }

  @Post('simple')
  async createSimple(
    @Body() body: { name: string; cnpj: string; phone: string },
    @CurrentUser() user: User,
  ): Promise<ApiSuccessResponse<Company>> {
    this.logger.debug(`Creating simple company for user: ${user.id}`);

    const company = await this.companyService.createSimple(
      body.name,
      body.cnpj,
      body.phone,
      user.id,
    );

    return ApiResponseBuilder.success(company, 'Empresa criada com sucesso');
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async findAll(): Promise<ApiSuccessResponse<Company[]>> {
    this.logger.debug('Getting all companies');

    const companies = await this.companyService.findAll();

    return ApiResponseBuilder.success(
      companies,
      `${companies.length} empresas encontradas`,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiSuccessResponse<Company>> {
    this.logger.debug(`Getting company ${id}`);

    const company = await this.companyService.findOne(id);

    return ApiResponseBuilder.success(company, 'Empresa encontrada');
  }

  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ApiSuccessResponse<Company>> {
    this.logger.debug(`Getting company by slug: ${slug}`);

    const company = await this.companyService.findBySlug(slug);

    return ApiResponseBuilder.success(company, 'Empresa encontrada');
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<ApiSuccessResponse<Company>> {
    this.logger.debug(`Updating company ${id}`);

    const company = await this.companyService.update(id, updateCompanyDto);

    return ApiResponseBuilder.success(
      company,
      'Empresa atualizada com sucesso',
    );
  }

  @Patch(':id/colors')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async updateColors(
    @Param('id') id: string,
    @Body() updateCompanyColorsDto: UpdateCompanyColorsDto,
  ): Promise<ApiSuccessResponse<Company>> {
    this.logger.debug(`Updating company colors ${id}`);

    const company = await this.companyService.updateColors(
      id,
      updateCompanyColorsDto,
    );

    return ApiResponseBuilder.success(
      company,
      'Cores da empresa atualizadas com sucesso',
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async remove(
    @Param('id') id: string,
  ): Promise<ApiSuccessResponse<{ id: string }>> {
    this.logger.debug(`Removing company ${id}`);

    await this.companyService.remove(id);

    return ApiResponseBuilder.success({ id }, 'Empresa removida com sucesso');
  }

  /**
   * Endpoint para corrigir roles de usuários que criaram empresas mas ainda são CLIENT
   * Útil para corrigir dados existentes após implementação da correção
   */
  @Post('fix-user-roles')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async fixUserRoles(): Promise<ApiSuccessResponse<{ fixed: number }>> {
    this.logger.debug('Fixing user roles for company owners');

    const result = await this.companyService.fixUserRoles();

    return ApiResponseBuilder.success(
      result,
      `${result.fixed} usuários tiveram suas roles corrigidas para OWNER`,
    );
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../core/enums/user-role.enum';
import { UsersService } from '../users/user.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyColorsDto } from './dto/update-company-colors.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  async createSimple(
    name: string,
    cnpj: string,
    phone: string,
    userId: string,
  ): Promise<Company> {
    // Verifica se o usuário já tem uma empresa
    const user = await this.userService.findOne(userId);
    if (user.companyId) {
      throw new BadRequestException('Usuário já possui uma empresa');
    }

    // Gera slug a partir do nome
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Verifica se o slug já existe
    const existingCompany = await this.companyRepository.findOne({
      where: { slug },
    });

    if (existingCompany) {
      throw new BadRequestException('Nome de empresa já está em uso');
    }

    // Verifica se o CNPJ já existe
    const existingCnpj = await this.companyRepository.findOne({
      where: { cnpj },
    });

    if (existingCnpj) {
      throw new BadRequestException('CNPJ já está em uso');
    }

    // Cria a empresa com dados fornecidos
    const company = this.companyRepository.create({
      legalName: name,
      tradeName: name,
      slug,
      cnpj,
      email: user.email,
      phone,
      logoUrl: '',
    });

    const savedCompany = await this.companyRepository.save(company);

    // CORREÇÃO: Atualiza o usuário para associar à empresa E definir como OWNER
    await this.userService.update(userId, {
      companyId: savedCompany.id,
      role: UserRole.OWNER, // Define o criador da empresa como OWNER
    });

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      relations: ['users'],
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  async updateColors(
    id: string,
    updateCompanyColorsDto: UpdateCompanyColorsDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyColorsDto);
    return await this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
  }

  async findBySlug(slug: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { slug },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com slug ${slug} não encontrada`);
    }

    return company;
  }

  /**
   * Método para corrigir usuários que criaram empresas mas têm role CLIENT
   * Este método pode ser usado para corrigir dados existentes
   */
  async fixUserRoles(): Promise<{ fixed: number }> {
    // Buscar usuários que têm empresa mas são CLIENT
    const usersToFix =
      await this.userService.findUsersWithCompanyButClientRole();

    let fixed = 0;
    for (const user of usersToFix) {
      await this.userService.update(user.id, { role: UserRole.OWNER });
      fixed++;
    }

    return { fixed };
  }
}

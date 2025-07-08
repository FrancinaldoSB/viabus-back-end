import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/user.service';
import { CreateCompanyDto } from './dto/create-company.dto';
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

    // Atualiza o usuário para associar à empresa
    await this.userService.update(userId, { companyId: savedCompany.id });

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
}

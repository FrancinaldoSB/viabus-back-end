import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';

export interface CompanyEntity {
  id: string;
  companyId: string;
}

export abstract class BaseCompanyService<T extends CompanyEntity> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly repository: Repository<T>) {}

  protected abstract getEntityName(): string;

  protected getDefaultFindOptions(): FindManyOptions<T> {
    return {};
  }

  async findAll(companyId: string): Promise<T[]> {
    if (!companyId) {
      throw new BadRequestException(`Usuário não possui empresa associada`);
    }

    this.logger.debug(`Buscando todas as entidades para empresa: ${companyId}`);

    const options: FindManyOptions<T> = {
      ...this.getDefaultFindOptions(),
      where: { companyId } as FindManyOptions<T>['where'],
    };

    return this.repository.find(options);
  }

  async findOne(id: string, companyId: string): Promise<T> {
    if (!companyId) {
      throw new BadRequestException(`Usuário não possui empresa associada`);
    }

    this.logger.debug(
      `Buscando ${this.getEntityName()} ${id} para empresa: ${companyId}`,
    );

    const options: FindOneOptions<T> = {
      ...this.getDefaultFindOptions(),
      where: { id, companyId } as FindOneOptions<T>['where'],
    };

    const entity = await this.repository.findOne(options);

    if (!entity) {
      throw new NotFoundException(
        `${this.getEntityName()} com ID ${id} não encontrada para a empresa`,
      );
    }

    return entity;
  }

  async create(data: Partial<T>, companyId: string): Promise<T> {
    if (!companyId) {
      throw new BadRequestException(`Usuário não possui empresa associada`);
    }

    this.logger.debug(
      `Criando ${this.getEntityName()} para empresa: ${companyId}`,
    );

    const entity = this.repository.create({
      ...data,
      companyId,
    } as T);

    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<T>, companyId: string): Promise<T> {
    const entity = await this.findOne(id, companyId);

    this.logger.debug(
      `Atualizando ${this.getEntityName()} ${id} para empresa: ${companyId}`,
    );

    Object.assign(entity, data);
    return this.repository.save(entity);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const entity = await this.findOne(id, companyId);

    this.logger.debug(
      `Removendo ${this.getEntityName()} ${id} para empresa: ${companyId}`,
    );

    await this.repository.remove(entity);
  }
}

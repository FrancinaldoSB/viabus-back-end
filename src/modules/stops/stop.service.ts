import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import { PaginationParams } from '../../core/interfaces/api-response';
import { Address } from '../addresses/entities/address.entity';
import { CreateStopDto, UpdateStopDto } from './dto/create-stop.dto';
import { Stop } from './entities/stop.entity';

@Injectable()
export class StopsService extends BaseCompanyService<Stop> {
  constructor(
    @InjectRepository(Stop)
    protected readonly repository: Repository<Stop>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(repository);
  }

  protected getEntityName(): string {
    return 'Stop';
  }

  protected getDefaultFindOptions(): FindManyOptions<Stop> {
    return {
      relations: ['address', 'routeStops'],
    };
  }

  // Método para buscar e contar com paginação
  async findAndCount(
    companyId: string,
    pagination: PaginationParams,
  ): Promise<[Stop[], number]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = pagination;

    const options: FindManyOptions<Stop> = {
      ...this.getDefaultFindOptions(),
      where: { companyId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    };

    return this.repository.findAndCount(options);
  }

  // Método específico para criar parada com validação de negócio
  async createStop(
    createStopDto: CreateStopDto,
    companyId: string,
  ): Promise<Stop> {
    // Validações específicas de parada
    if (!createStopDto.name || createStopDto.name.trim().length < 3) {
      throw new Error('Nome da parada deve ter pelo menos 3 caracteres');
    }

    // Criar primeiro o endereço
    const address = this.addressRepository.create(createStopDto.address);
    const savedAddress = await this.addressRepository.save(address);

    // Criar a parada com o endereço salvo
    const stopData = {
      name: createStopDto.name,
      addressId: savedAddress.id,
      isActive: createStopDto.isActive ?? true,
      hasAccessibility: createStopDto.hasAccessibility ?? false,
      hasShelter: createStopDto.hasShelter ?? false,
      companyId,
    };

    const stop = this.repository.create(stopData);
    return this.repository.save(stop);
  }

  // Método específico para atualizar parada com DTO
  async updateStop(
    id: string,
    updateStopDto: UpdateStopDto,
    companyId: string,
  ): Promise<Stop> {
    // Se há dados de endereço no DTO, atualizar o endereço primeiro
    if (updateStopDto.address) {
      const stop = await this.findOne(id, companyId);
      await this.addressRepository.update(
        stop.addressId,
        updateStopDto.address,
      );
    }

    // Converter DTO para formato da entidade (removendo address do DTO)
    const { address, ...stopData } = updateStopDto;

    // Usar o método update herdado do BaseCompanyService
    return this.update(id, stopData, companyId);
  }

  // Método específico para buscar paradas ativas
  async findActiveStops(companyId: string): Promise<Stop[]> {
    const options: FindManyOptions<Stop> = {
      ...this.getDefaultFindOptions(),
      where: { companyId, isActive: true } as any,
    };

    return this.repository.find(options);
  }

  // Método específico para buscar paradas por localização
  async findStopsNearLocation(
    companyId: string,
    latitude: number,
    longitude: number,
    radiusKm: number = 1,
  ): Promise<Stop[]> {
    // Esta é uma implementação simplificada
    // Em produção, você usaria PostGIS ou similar para busca geoespacial
    const stops = await this.findAll(companyId);

    return stops.filter((stop) => {
      if (!stop.address?.latitude || !stop.address?.longitude) {
        return false;
      }

      const lat1 = stop.address.latitude;
      const lng1 = stop.address.longitude;
      const distance = this.calculateDistance(latitude, longitude, lat1, lng1);

      return distance <= radiusKm;
    });
  }

  // Método auxiliar para calcular distância entre coordenadas
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

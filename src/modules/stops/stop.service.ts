import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stop } from './entities/stop.entity';
import { Repository } from 'typeorm';
import { CreateStopDto } from './dto/create-stop.dto';
import { Address } from '../addresses/entities/address.entity';

@Injectable()
export class StopsService {
  constructor(
    @InjectRepository(Stop)
    private readonly stopRepository: Repository<Stop>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getStops(companyId: string): Promise<Stop[]> {
    return await this.stopRepository.find({
      where: { companyId },
      relations: ['address'],
    });
  }

  async getStop(id: string, companyId: string): Promise<Stop> {
    const stop = await this.stopRepository.findOne({
      where: { id, companyId },
      relations: ['address'],
    });

    if (!stop) {
      throw new NotFoundException(`Parada com ID ${id} não encontrada`);
    }

    return stop;
  }

  async create(createStopDto: CreateStopDto, companyId: string): Promise<Stop> {
    // Criar o endereço primeiro
    const address = this.addressRepository.create(createStopDto.address);
    const savedAddress = await this.addressRepository.save(address);

    // Criar a parada vinculada ao endereço
    const stop = this.stopRepository.create({
      name: createStopDto.name,
      addressId: savedAddress.id,
      isActive:
        createStopDto.isActive !== undefined ? createStopDto.isActive : true,
      hasAccessibility: createStopDto.hasAccessibility || false,
      hasShelter: createStopDto.hasShelter || false,
      companyId,
    });

    const savedStop = await this.stopRepository.save(stop);
    savedStop.address = savedAddress;

    return savedStop;
  }

  async updateStop(
    id: string,
    updateStopDto: Partial<CreateStopDto>,
    companyId: string,
  ): Promise<Stop> {
    const stop = await this.getStop(id, companyId);

    // Se tiver atualizações de endereço
    if (updateStopDto.address) {
      // Atualizar o endereço existente
      Object.assign(stop.address, updateStopDto.address);
      await this.addressRepository.save(stop.address);
    }

    // Atualizar a parada, excluindo a propriedade address
    const { address, ...stopData } = updateStopDto;
    Object.assign(stop, stopData);

    return await this.stopRepository.save(stop);
  }

  async removeStop(id: string, companyId: string): Promise<void> {
    const stop = await this.getStop(id, companyId);
    const addressId = stop.addressId;

    // Remover a parada
    await this.stopRepository.remove(stop);

    // Remover o endereço associado
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
    });
    if (address) {
      await this.addressRepository.remove(address);
    }
  }
}

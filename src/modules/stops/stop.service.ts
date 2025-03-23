import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stop } from './entities/stop.entity';
import { Repository } from 'typeorm';
import { CreateStopDto } from './dto/create-stop.dto';

@Injectable()
export class StopsService {
  constructor(
    @InjectRepository(Stop)
    private readonly stopRepository: Repository<Stop>,
  ) {}

  async getStops(companyId: string): Promise<Stop[]> {
    return await this.stopRepository.find({ where: { companyId } });
  }

  async getStop(id: string, companyId: string): Promise<Stop> {
    const stop = await this.stopRepository.findOne({
      where: { id, companyId },
    });

    if (!stop) {
      throw new NotFoundException(`Parada com ID ${id} não encontrada`);
    }

    return stop;
  }

  async create(createStopDto: CreateStopDto, companyId: string): Promise<Stop> {
    const stop = this.stopRepository.create({
      ...createStopDto,
      companyId,
    });

    return await this.stopRepository.save(stop);
  }

  async updateStop(
    id: string,
    updateStopDto: Partial<CreateStopDto>,
    companyId: string,
  ): Promise<Stop> {
    const stop = await this.getStop(id, companyId);
    Object.assign(stop, updateStopDto);
    return await this.stopRepository.save(stop);
  }

  async removeStop(id: string, companyId: string): Promise<void> {
    const stop = await this.getStop(id, companyId);
    await this.stopRepository.remove(stop);
  }
}

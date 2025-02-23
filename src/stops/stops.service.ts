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

  async getStops(): Promise<Stop[]> {
    return await this.stopRepository.find();
  }

  async getStop(id: string): Promise<Stop> {
    const stop = await this.stopRepository.findOneBy({ id });
    if (!stop) {
      throw new NotFoundException(`Parada com ID ${id} não encontrada`);
    }
    return stop;
  }

  async create(createStopDto: CreateStopDto): Promise<Stop> {
    const stop = this.stopRepository.create(createStopDto);
    return await this.stopRepository.save(stop);
  }

  async updateStop(
    id: string,
    updateStopDto: Partial<CreateStopDto>,
  ): Promise<Stop> {
    const stop = await this.getStop(id);
    Object.assign(stop, updateStopDto);
    return await this.stopRepository.save(stop);
  }

  async removeStop(id: string): Promise<void> {
    const stop = await this.getStop(id);
    await this.stopRepository.remove(stop);
  }
}

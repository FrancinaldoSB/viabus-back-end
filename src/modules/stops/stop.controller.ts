import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { CreateStopDto } from './dto/create-stop.dto';
import { StopsService } from './stop.service';
import { CurrentCompany } from '../auth/decorators/current-company.decorator';

@Controller('stops')
export class StopsController {
  private readonly logger = new Logger(StopsController.name);

  constructor(private readonly stopsService: StopsService) {}

  @Get()
  getAllStops(@CurrentCompany() company: any) {
    this.logger.debug(`Company in getAllStops: ${JSON.stringify(company)}`);

    if (!company) {
      throw new UnauthorizedException('Empresa não identificada');
    }

    return this.stopsService.getStops(company.id);
  }

  @Get(':id')
  getStop(@Param('id') id: string, @CurrentCompany() company: any) {
    this.logger.debug(`Company in getStop: ${JSON.stringify(company)}`);

    if (!company) {
      throw new UnauthorizedException('Empresa não identificada');
    }

    return this.stopsService.getStop(id, company.id);
  }

  @Put(':id')
  updateStop(
    @Param('id') id: string,
    @Body() updateStopDto: Partial<CreateStopDto>,
    @CurrentCompany() company: any,
  ) {
    this.logger.debug(`Company in updateStop: ${JSON.stringify(company)}`);

    if (!company) {
      throw new UnauthorizedException('Empresa não identificada');
    }

    return this.stopsService.updateStop(id, updateStopDto, company.id);
  }

  @Post()
  create(@Body() createStopDto: CreateStopDto, @CurrentCompany() company: any) {
    this.logger.debug(`Company in create: ${JSON.stringify(company)}`);

    if (!company) {
      this.logger.error('Empresa não identificada no create');
      throw new UnauthorizedException('Empresa não identificada');
    }

    this.logger.debug(`CompanyId: ${company.id}`);
    return this.stopsService.create(createStopDto, company.id);
  }

  @Delete(':id')
  removeStop(@Param('id') id: string, @CurrentCompany() company: any) {
    this.logger.debug(`Company in removeStop: ${JSON.stringify(company)}`);

    if (!company) {
      throw new UnauthorizedException('Empresa não identificada');
    }

    return this.stopsService.removeStop(id, company.id);
  }
}

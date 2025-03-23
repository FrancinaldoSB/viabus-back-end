import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Logger,
} from '@nestjs/common';
import { CreateStopDto } from './dto/create-stop.dto';
import { StopsService } from './stop.service';
import { CurrentCompany } from '../auth/decorators/current-company.decorator';
import { RequireCompany } from '../auth/guards/current-company.guard';

@Controller('stops')
@RequireCompany()
export class StopsController {
  private readonly logger = new Logger(StopsController.name);

  constructor(private readonly stopsService: StopsService) {}

  @Get()
  getAllStops(@CurrentCompany() company: any) {
    return this.stopsService.getStops(company.id);
  }

  @Get(':id')
  getStop(@Param('id') id: string, @CurrentCompany() company: any) {
    return this.stopsService.getStop(id, company.id);
  }

  @Put(':id')
  updateStop(
    @Param('id') id: string,
    @Body() updateStopDto: Partial<CreateStopDto>,
    @CurrentCompany() company: any,
  ) {
    return this.stopsService.updateStop(id, updateStopDto, company.id);
  }

  @Post()
  create(@Body() createStopDto: CreateStopDto, @CurrentCompany() company: any) {
    this.logger.debug(`Creating stop with companyId: ${company.id}`);
    return this.stopsService.create(createStopDto, company.id);
  }

  @Delete(':id')
  removeStop(@Param('id') id: string, @CurrentCompany() company: any) {
    return this.stopsService.removeStop(id, company.id);
  }
}

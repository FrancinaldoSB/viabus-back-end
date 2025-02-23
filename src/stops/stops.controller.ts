import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateStopDto } from './dto/create-stop.dto';
import { StopsService } from './stops.service';

@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  getAllStops() {
    return this.stopsService.getStops();
  }

  @Get(':id')
  getStop(@Param('id') id: string) {
    return this.stopsService.getStop(id);
  }

  @Put(':id')
  updateStop(
    @Param('id') id: string,
    @Body() updateStopDto: Partial<CreateStopDto>,
  ) {
    return this.stopsService.updateStop(id, updateStopDto);
  }

  @Post()
  create(@Body() createStopDto: CreateStopDto) {
    return this.stopsService.create(createStopDto);
  }

  @Delete(':id')
  removeStop(@Param('id') id: string) {
    return this.stopsService.removeStop(id);
  }
}

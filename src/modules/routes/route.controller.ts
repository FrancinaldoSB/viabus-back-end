import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateRouteDto } from "./dto/create-route.dto";

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) { }
  
  @Get()
  getAllRoutes() {
    return this.routesService.getRoutes();
  }

  @Get(':id')
  getRoute(@Param('id') id: string) {
    return this.routesService.getRoute(id);
  }

  @Put(':id')
  updateRoute(
    @Param('id') id: string,
    @Body() updateRouteDto: Partial<CreateRouteDto>,
  ) {
    return this.routesService.updateRoute(id, updateRouteDto);
  }

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Delete(':id')
  removeRoute(@Param('id') id: string) {
    return this.routesService.removeRoute(id);
  }
}
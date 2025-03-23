import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateRouteDto } from "./dto/create-route.dto";
import { RouteService } from "./route.service";

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) { }
  
  @Get()
  getAllRoutes() {
    return this.routeService.getRoutes();
  }

  @Get(':id')
  getRoute(@Param('id') id: string) {
    return this.routeService.getRoute(id);
  }

  @Put(':id')
  updateRoute(
    @Param('id') id: string,
    @Body() updateRouteDto: Partial<CreateRouteDto>,
  ) {
    return this.routeService.updateRoute(id, updateRouteDto);
  }

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Delete(':id')
  removeRoute(@Param('id') id: string) {
    return this.routeService.removeRoute(id);
  }
}
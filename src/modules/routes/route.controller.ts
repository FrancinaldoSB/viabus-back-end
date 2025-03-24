import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateRouteDto } from "./dto/create-route.dto";
import { RouteService } from "./route.service";

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RouteService) { }
  
  @Get()
  getAllRoutes(@CurrentCompany() company: any) {
    return this.routeService.getRoutes(company.id);
  }

  @Get(':id')
  getRoute(@Param('id') id: string, @CurrentCompany() company: any) {
    return this.routeService.getRoute(id, company.id);
  }

  @Put(':id')
  updateRoute(
    @Param('id') id: string,
    @Body() updateRouteDto: Partial<CreateRouteDto>,
    @CurrentCompany() company: any,
  ) {
    return this.routeService.updateRoute(id, updateRouteDto, company.id);
  }

  @Post()
  create(
    @Body() createRouteDto: CreateRouteDto,
    @CurrentCompany() company: any,
  ) {
    return this.routeService.create(createRouteDto, company.id);
  }

  @Delete(':id')
  removeRoute(@Param('id') id: string, @CurrentCompany() company: any) {
    return this.routeService.removeRoute(id, company.id);
  }
}

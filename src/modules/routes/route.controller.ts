import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../core/enums/user-role.enum';
import { CompanyFilter } from '../../common/decorators/company-filter.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CompanyFilterInterceptor,
  UseCompanyFilter,
} from '../../common/interceptors/company-filter.interceptor';
import { CreateRouteDto } from './dto/create-route.dto';
import { RouteService } from './route.service';

@Controller('routes')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CompanyFilterInterceptor)
export class RoutesController {
  constructor(private readonly routesService: RouteService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.EMPLOYEE)
  @UseCompanyFilter()
  getAllRoutes(@CompanyFilter() companyId: string) {
    return this.routesService.findAll(companyId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.EMPLOYEE)
  @UseCompanyFilter()
  getRoute(@Param('id') id: string, @CompanyFilter() companyId: string) {
    return this.routesService.findOne(id, companyId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseCompanyFilter()
  updateRoute(
    @Param('id') id: string,
    @Body() updateRouteDto: Partial<CreateRouteDto>,
    @CompanyFilter() companyId: string,
  ) {
    return this.routesService.update(id, updateRouteDto, companyId);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseCompanyFilter()
  createRoute(
    @Body() createRouteDto: CreateRouteDto,
    @CompanyFilter() companyId: string,
  ) {
    return this.routesService.create(createRouteDto, companyId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseCompanyFilter()
  removeRoute(@Param('id') id: string, @CompanyFilter() companyId: string) {
    return this.routesService.remove(id, companyId);
  }
}

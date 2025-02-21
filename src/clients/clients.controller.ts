import { Controller, Get } from '@nestjs/common';

@Controller('clients')
export class ClientsController {
  @Get()
  findAll() {
    return 'This action returns all clients';
  }
}

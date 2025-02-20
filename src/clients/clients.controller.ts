import { Controller, Get } from '@nestjs/common';

@Controller('clients')
export class ClientsController {
  @Get()
  findAll(): string {
    return 'This action returns all clients';
  }
}

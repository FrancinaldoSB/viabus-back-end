import { IsBoolean, IsInt, Max, Min } from 'class-validator';

export class CreateRouteScheduleDto {
  @IsInt({ message: 'dayOfWeek deve ser um número inteiro' })
  @Min(0, { message: 'dayOfWeek deve ser entre 0 e 6' })
  @Max(6, { message: 'dayOfWeek deve ser entre 0 e 6' })
  dayOfWeek: number;

  @IsBoolean({ message: 'isActive deve ser um valor booleano' })
  isActive: boolean;
}

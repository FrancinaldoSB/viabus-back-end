import { IsString } from "class-validator";

export class CreateRouteDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  estimatedDuration: string;

  @IsString()
  distance: string;



}
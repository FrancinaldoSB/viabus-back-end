import { IsString } from "class-validator";

export class CreateStopDto {
  @IsString()
  name: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  address: string;
}
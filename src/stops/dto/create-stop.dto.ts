import { IsString, Length } from "class-validator";

export class CreateStopDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 100)
  latitude: string;

  @IsString()
  @Length(1, 100)
  longitude: string;

  @IsString()
  @Length(1, 100)
  address: string;
}
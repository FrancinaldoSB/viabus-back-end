import { IsString, Matches } from 'class-validator';

export class UpdateCompanyColorsDto {
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'primaryColor deve ser uma cor hexadecimal válida (#RRGGBB)',
  })
  primaryColor: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'secondaryColor deve ser uma cor hexadecimal válida (#RRGGBB)',
  })
  secondaryColor: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

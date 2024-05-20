import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  patronymic: string;

  @IsOptional()
  @IsNumber()
  roleId: number;
}

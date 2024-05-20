import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  patronymic: string;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}

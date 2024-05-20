import { IsArray, IsNotEmpty } from 'class-validator';

export class ChangeUsersDto {
  @IsNotEmpty()
  @IsArray()
  users: number[];
}

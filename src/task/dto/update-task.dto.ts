import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

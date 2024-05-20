import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskLogDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  taskId: number;

  @IsNotEmpty()
  @IsNumber()
  taskLogTypeId: number;
}

import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  startedAt: Date;

  @IsNotEmpty()
  plannedEndedAt: Date;

  @IsNotEmpty()
  @IsArray()
  users: number[];
}

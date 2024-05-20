import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePriorityDto {
  @IsNotEmpty()
  @IsString()
  priority: string;
}

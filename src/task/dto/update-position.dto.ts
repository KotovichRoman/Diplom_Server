import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsNotEmpty()
  @IsNumber()
  currentPosition: number;

  @IsNotEmpty()
  @IsString()
  newPosition: number;
}

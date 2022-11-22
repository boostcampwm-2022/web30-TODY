import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class createRoomDto {
  @IsString()
  @MaxLength(10, { message: 'title is too long' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'content is too long' })
  readonly content: string;

  @IsNumber()
  @Min(1)
  readonly maxPersonnel: number;

  // 배열이면 each true, 옵션값이면 IsOptional 사용
  @IsOptional()
  @IsString({ each: true })
  readonly tags: string[];
}

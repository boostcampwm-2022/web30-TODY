import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class createRoomDto {
  @IsString()
  readonly managerId: string;

  @IsString()
  @MaxLength(10, { message: 'title is too long' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'content is too long' })
  readonly content: string;

  @IsNumber()
  @Min(1)
  readonly maxPersonnel: number;

  @IsOptional()
  @IsString({ each: true })
  readonly tags: string[];
}

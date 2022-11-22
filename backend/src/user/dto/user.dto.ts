import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly id: string;

  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,20}$/)
  readonly password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly nickname: string;
}

export class CheckNicknameDto {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly nickname: string;
}

export class CheckIdDto {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly id: string;
}

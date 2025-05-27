import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @MaxLength(500)
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @MaxLength(500)
  @IsNotEmpty()
  public password: string;
}

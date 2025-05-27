import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(500)
  @IsNotEmpty()
  public username: string;

  @MaxLength(500)
  @IsNotEmpty()
  public email: string;
}

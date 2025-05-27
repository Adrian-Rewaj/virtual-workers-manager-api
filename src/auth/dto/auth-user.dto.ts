import { IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty()
  public userId: number;

  @IsNotEmpty()
  public username: string;
}

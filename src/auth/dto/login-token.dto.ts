import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RefreshTokenDto } from './refresh-token.dto';

export class LoginTokenDto extends RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  public accessToken: string;
}

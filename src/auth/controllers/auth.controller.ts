import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
} from '@nestjs/common';
import { VirtualWorker } from '../../common/config';
import { AMQPMessage } from '../../consumer/entities/AMQPMessage';
import { ConsumerService } from '../../consumer/services/consumer.service';
import { Public } from '../decorators/auth.decorator';
import { LoginTokenDto } from '../dto/login-token.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private consumerService: ConsumerService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async signIn(@Body() signInDto: SignInDto): Promise<LoginTokenDto> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  public async refreshToken(
    @Body() refreshToken: RefreshTokenDto,
  ): Promise<LoginTokenDto> {
    return this.authService.refreshToken(refreshToken.refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('test')
  public async test(): Promise<void> {
    const msg: AMQPMessage = {
      worker: VirtualWorker.FORM_BOT,
      settings: {
        formId: 1,
        subscriberId: 1,
      },
    };
    this.consumerService.sendMessage(msg, 3000);
  }
}

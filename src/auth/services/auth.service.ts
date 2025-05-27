import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config as appConfig } from '../../common/config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { AuthUserDto } from '../dto/auth-user.dto';
import { LoginTokenDto } from '../dto/login-token.dto';
import { AuthEncryptorService } from './auth-encryptor.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private authEncryptorService: AuthEncryptorService,
  ) {}

  public async signIn(
    username: string,
    password: string,
  ): Promise<LoginTokenDto> {
    const user = await this.getUser(username, password);
    const authUser = this.getAuthUser(user);
    return this.getLoginToken(authUser);
  }

  public async refreshToken(refreshToken: string): Promise<LoginTokenDto> {
    const authUser = await this.verifyRefreshToken(refreshToken);
    if (!authUser) {
      throw new UnauthorizedException();
    }

    return this.getLoginToken({
      userId: authUser.userId,
      username: authUser.username,
    });
  }

  protected async verifyRefreshToken(
    refreshToken: string,
  ): Promise<AuthUserDto> {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: appConfig.jwt.refreshTokenSecret,
    });
  }

  protected async getLoginToken(authUser: AuthUserDto): Promise<LoginTokenDto> {
    const loginToken = new LoginTokenDto();
    loginToken.accessToken = await this.getAccessToken(authUser);
    loginToken.refreshToken = await this.getRefreshToken(authUser);
    return loginToken;
  }

  protected async getRefreshToken(authUser: AuthUserDto): Promise<string> {
    return this.jwtService.signAsync(authUser, {
      secret: appConfig.jwt.refreshTokenSecret,
      expiresIn: appConfig.jwt.refreshTokenExpiresIn,
    });
  }

  protected async getAccessToken(authUser: AuthUserDto): Promise<string> {
    return this.jwtService.signAsync(authUser, {
      secret: appConfig.jwt.secret,
      expiresIn: appConfig.jwt.expiresIn,
    });
  }

  protected getAuthUser(user: User): AuthUserDto {
    if (!user) {
      throw new NotFoundException();
    }

    return {
      userId: user.id,
      username: user.username,
    } as AuthUserDto;
  }

  protected async getUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({
      username,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await this.authEncryptorService.verify(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

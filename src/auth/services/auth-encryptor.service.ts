import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthEncryptorService {
  public async encrypt(password: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
          reject(error);
        }
        resolve(hash);
      });
    });
  }

  public async verify(
    rawPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      bcrypt.compare(rawPassword, encryptedPassword, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res === true);
      });
    });
  }
}

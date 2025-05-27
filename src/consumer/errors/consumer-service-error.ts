import { HttpException } from '@nestjs/common';

export class ConsumerServiceError extends HttpException {
  constructor() {
    super('ConsumerService is unavailable!', 503);
    this.message = 'ConsumerService is unavailable!';
    this.name = 'UnknownError';
  }
}

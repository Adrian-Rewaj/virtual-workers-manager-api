import { HttpException } from '@nestjs/common';

export class UnknownError extends HttpException {
  constructor() {
    super('Something went wrong...', 404);
    this.message = 'Something went wrong...';
    this.name = 'UnknownError';
  }
}

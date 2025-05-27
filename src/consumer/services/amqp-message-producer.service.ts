import { Injectable } from '@nestjs/common';
import { AMQPMessage } from '../entities/AMQPMessage';
import { AmqpMessageProducerInterface } from '../interfaces/amqp-message-producer.interface';

@Injectable()
export class AMQPMessageProducerService
  implements AmqpMessageProducerInterface
{
  private message: AMQPMessage;

  public async handle(): Promise<AMQPMessage> {
    return this.message;
  }

  public async setMessage(message: AMQPMessage): Promise<void> {
    this.message = message;
  }
}

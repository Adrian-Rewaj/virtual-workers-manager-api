import { Injectable } from '@nestjs/common';
import { config } from '../../common/config';
import { AMQPMessage } from '../entities/AMQPMessage';
import { ConsumerServiceError } from '../errors/consumer-service-error';
import { AMQPMessageProducerService } from './amqp-message-producer.service';
import { AMQPService } from './amqp.service';

@Injectable()
export class ConsumerService {
  public constructor(
    private readonly amqpService: AMQPService,
    private readonly amqpMessageProducerService: AMQPMessageProducerService,
  ) {}

  public async sendMessage(
    message: AMQPMessage,
    delay: number = 0,
  ): Promise<void> {
    try {
      await this.amqpMessageProducerService.setMessage(message);
      await this.amqpService.publish(
        this.amqpMessageProducerService,
        config.amqp.queue,
        delay,
      );
    } catch (error: any) {
      throw new ConsumerServiceError();
    }
  }
}

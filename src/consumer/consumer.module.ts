import { Module } from '@nestjs/common';
import { AMQPMessageProducerService } from './services/amqp-message-producer.service';
import { AMQPService } from './services/amqp.service';
import { ConsumerService } from './services/consumer.service';
import { MessageContentParserService } from './services/message-content-parser.service';

@Module({
  providers: [
    ConsumerService,
    AMQPService,
    AMQPMessageProducerService,
    MessageContentParserService,
  ],
  exports: [
    ConsumerService,
    AMQPService,
    AMQPMessageProducerService,
    MessageContentParserService,
  ],
})
export class ConsumerModule {}

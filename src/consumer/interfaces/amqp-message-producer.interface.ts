import { AMQPMessage } from '../entities/AMQPMessage';
import { AmqpMessageHandlerInterface } from './amqp-message-handler.interface';

export interface AmqpMessageProducerInterface
  extends AmqpMessageHandlerInterface {
  handle(): Promise<AMQPMessage>;

  setMessage(message: AMQPMessage): Promise<void>;
}

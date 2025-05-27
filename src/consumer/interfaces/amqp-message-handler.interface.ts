import { AMQPMessage } from '../entities/AMQPMessage';

export interface AmqpMessageHandlerInterface {
  handle(msg?: AMQPMessage): Promise<AMQPMessage>;
}

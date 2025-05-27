import { Injectable } from '@nestjs/common';
import { Channel, connect } from 'amqplib/callback_api';
import { config } from '../../common/config';
import { UnknownError } from '../errors/unknown-error';
import { AmqpMessageHandlerInterface } from '../interfaces/amqp-message-handler.interface';
import { MessageContentParserService } from './message-content-parser.service';

export enum AMQPChannelTransferMethod {
  EXCHANGE = 'EXCHANGE',
  QUEUE = 'QUEUE',
}

@Injectable()
export class AMQPService {
  public constructor(
    private readonly messageContentParserService: MessageContentParserService,
  ) {}

  public async sendToQueue(
    amqpMessageHandler: AmqpMessageHandlerInterface,
    queue: string,
  ): Promise<void> {
    return this.connect(
      amqpMessageHandler,
      queue,
      async (
        channel: Channel,
        amqpMessageHandler: AmqpMessageHandlerInterface,
      ): Promise<void> => {
        const amqpMessage = await amqpMessageHandler.handle();
        console.log(`sendToQueue ${queue}`);
        console.log('message: ', amqpMessage);
        const message =
          await this.messageContentParserService.stringify(amqpMessage);
        channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
      },
      AMQPChannelTransferMethod.QUEUE,
    );
  }

  public async publish(
    amqpMessageHandler: AmqpMessageHandlerInterface,
    exchange: string,
    delay: number = 0,
  ): Promise<void> {
    return this.connect(
      amqpMessageHandler,
      exchange,
      async (
        channel: Channel,
        amqpMessageHandler: AmqpMessageHandlerInterface,
      ): Promise<void> => {
        const amqpMessage = await amqpMessageHandler.handle();
        console.log(`publish ${exchange}`);
        console.log('message: ', amqpMessage);
        const message =
          await this.messageContentParserService.stringify(amqpMessage);
        channel.publish(exchange, '', Buffer.from(message), {
          headers: {
            'x-delay': delay,
          },
        });
      },
      AMQPChannelTransferMethod.EXCHANGE,
    );
  }

  public async consume(
    amqpMessageHandler: AmqpMessageHandlerInterface,
    queue: string,
  ): Promise<void> {
    return this.connect(
      amqpMessageHandler,
      queue,
      async (
        channel: Channel,
        amqpMessageHandler: AmqpMessageHandlerInterface,
      ): Promise<void> => {
        console.log(`Consume queue ${queue}`);
        channel.prefetch(1);
        await channel.consume(queue, async (message) => {
          console.log('message: ', message);
          if (message) {
            const amqpMessage = await this.messageContentParserService.parse(
              message.content.toString(),
            );
            await amqpMessageHandler.handle(amqpMessage);
            channel.ack(message);
          }
        });
      },
      AMQPChannelTransferMethod.QUEUE,
    );
  }

  public async assertQueue(
    amqpMessageHandler: AmqpMessageHandlerInterface,
    queue: string,
  ): Promise<void> {
    return this.connect(
      amqpMessageHandler,
      queue,
      async (
        channel: Channel,
        amqpMessageHandler: AmqpMessageHandlerInterface,
      ): Promise<void> => {
        console.log(`assertQueue ${queue}`);
        channel.prefetch(1);
        channel.assertQueue(
          '',
          {
            exclusive: true,
          },
          (error, assertQueue) => {
            if (error) {
              throw new UnknownError();
            }

            console.log(
              ' [*] Waiting for messages in %s. To exit press CTRL+C',
              assertQueue,
            );
            channel.bindQueue(assertQueue.queue, queue, '');
            channel.consume(
              assertQueue.queue,
              async (message) => {
                console.log('message: ', message);
                if (message) {
                  const amqpMessage =
                    await this.messageContentParserService.parse(
                      message.content.toString(),
                    );
                  await amqpMessageHandler.handle(amqpMessage);
                  channel.ack(message);
                }
              },
              // {
              //     noAck: true
              // }
            );
          },
        );
      },
      AMQPChannelTransferMethod.QUEUE,
    );
  }

  private async connect(
    amqpMessageHandler: AmqpMessageHandlerInterface,
    queue: string,
    channelAction: (
      channel: Channel,
      amqpMessageHandler: AmqpMessageHandlerInterface,
    ) => Promise<void>,
    channelTransferMethod: AMQPChannelTransferMethod,
  ): Promise<void> {
    await connect(
      {
        hostname: config.amqp.hostname,
        username: config.amqp.user,
        password: config.amqp.password,
      },
      (errorConnect, connection) => {
        if (errorConnect) {
          throw new UnknownError();
        }

        connection.createChannel((errorCreateChannel, channel) => {
          if (errorCreateChannel) {
            throw new UnknownError();
          }

          if (channelTransferMethod === AMQPChannelTransferMethod.QUEUE) {
            channel.assertQueue(queue, {
              durable: true,
            });
          }

          if (channelTransferMethod === AMQPChannelTransferMethod.EXCHANGE) {
            channel.assertExchange(queue, 'x-delayed-message', {
              autoDelete: false,
              durable: true,
              arguments: {
                'x-delayed-type': 'direct',
              },
            });
          }

          channelAction(channel, amqpMessageHandler);
        });
      },
    );
  }
}

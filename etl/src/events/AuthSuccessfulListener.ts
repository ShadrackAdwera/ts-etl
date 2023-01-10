import { initRedis } from '@adwesh/common';
import { Listener, AuthSuccessfulEvent, Subjects } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';

export class AuthSuccessfulListener extends Listener<AuthSuccessfulEvent> {
  subject: Subjects.AuthSuccessful = Subjects.AuthSuccessful;
  queueGroupName: string = 'ETL_QUEUE-GROUP';
  async onMessage(
    data: { userId: string; ttl: number },
    msg: Message
  ): Promise<void> {
    try {
      await initRedis.client.set(data.userId, data.userId, {
        EX: data.ttl / 1000,
      });
      msg.ack();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Method not implemented.'
      );
    }
  }
}

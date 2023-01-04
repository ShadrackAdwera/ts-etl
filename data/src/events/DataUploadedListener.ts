import { Listener, CsvUploadedEvent, Subjects } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';

// put this in the library
enum PossibleOutcomes {
  HomeWin = 'H',
  AwayWin = 'A',
  Draw = 'D',
}

export class DataUploadedListener extends Listener<CsvUploadedEvent> {
  subject: Subjects = Subjects.CsvUploaded;
  queueGroupName: string = 'DATA_QUEUE-GROUP';
  async onMessage(
    data: {
      matchDay: Date;
      homeTeam: string;
      awayTeam: string;
      homeScored: number;
      awayScored: number;
      winner: PossibleOutcomes;
      ref: string;
    },
    msg: Message
  ): Promise<void> {
    const { homeTeam, awayTeam, homeScored, awayScored } = data;
    console.log(`${homeTeam} ${homeScored} - ${awayTeam} ${awayScored}`);
    msg.ack();
  }
}

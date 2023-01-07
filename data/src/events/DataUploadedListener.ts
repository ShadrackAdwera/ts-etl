import { Listener, CsvUploadedEvent, Subjects } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';
import { DataRepo } from './../repo/repo';

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
      season: string;
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
    const {
      homeTeam,
      awayTeam,
      homeScored,
      awayScored,
      matchDay,
      ref,
      winner,
      season,
    } = data;
    try {
      await DataRepo.insert({
        awayScored,
        awayTeam,
        homeScored,
        homeTeam,
        matchDay: new Date(matchDay).toDateString(),
        ref,
        winner,
        season: Number(season),
      });
    } catch (error) {}
    msg.ack();
  }
}

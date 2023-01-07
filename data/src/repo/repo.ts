import { pgPool } from './../helpers/pool';
import { StatType } from './../helpers/types';

export class DataRepo {
  static async insert(data: StatType): Promise<StatType[]> {
    const {
      awayScored,
      awayTeam,
      homeScored,
      homeTeam,
      matchDay,
      ref,
      season,
      winner,
    } = data;
    const { rows } = await pgPool.query<StatType>(
      `INSERT INTO data (awayScored,homeScored, homeTeam, awayTeam, matchDay, referee, winner, season)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        awayScored,
        homeScored,
        homeTeam,
        awayTeam,
        new Date(matchDay).toDateString(),
        ref,
        winner,
        season,
      ]
    );
    return rows;
  }

  static async getAll(): Promise<StatType[]> {
    const { rows } = await pgPool.query<StatType>('SELECT * FROM data;');
    return rows;
  }

  static async getCount(): Promise<number> {
    const { rows } = await pgPool.query<{ count: string }>(
      'SELECT COUNT(*) FROM data;'
    );
    return Number(rows[0].count);
  }
}

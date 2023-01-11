import { pgPool } from './../helpers/pool';
import { StatType } from './../helpers/types';

export class DataRepo {
  static async insert(data: StatType): Promise<StatType> {
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
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
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
    return rows[0];
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

  static async updateRow(id: number, updatedData: StatType): Promise<StatType> {
    const {
      awayScored,
      awayTeam,
      homeScored,
      homeTeam,
      matchDay,
      ref,
      season,
      winner,
    } = updatedData;
    const { rows } = await pgPool.query<StatType>(
      `UPDATE data SET awayScored,
    homeScored = $1, 
    homeTeam = $2, 
    awayTeam = $3, 
    matchDay = $4, 
    referee = $5, 
    winner = $6, 
    season = $7 
    WHERE id = $8
     RETURNING *`,
      [
        awayScored,
        awayTeam,
        homeScored,
        homeTeam,
        matchDay,
        ref,
        season,
        winner,
        id,
      ]
    );
    return rows[0];
  }

  static async deleteRow(id: number): Promise<{ id: number }> {
    const { rows } = await pgPool.query(
      `DELETE FROM data WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0];
  }
}

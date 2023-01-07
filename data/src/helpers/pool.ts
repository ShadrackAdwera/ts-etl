import { Pool, PoolConfig, QueryResult, QueryResultRow, QueryConfig } from 'pg';

class PgPool {
  _pool?: Pool;

  connect(options: PoolConfig) {
    this._pool = new Pool(options);
    return this._pool.query(`SELECT 1 + 1`);
  }

  close() {
    return this._pool?.end();
  }

  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I
  ): Promise<QueryResult<R>> {
    return this._pool!.query(queryTextOrConfig, values);
  }
}

export const pgPool = new PgPool();

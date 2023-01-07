import { pgPool } from './helpers/pool';

import { app } from './app';
import { natsWraper } from '@adwesh/common';
import { DataUploadedListener } from './events/DataUploadedListener';

if (!process.env.PGDATABASE) {
  throw new Error('Database name must be defined');
}
if (!process.env.POSTGRES_PASSWORD) {
  throw new Error('Database password must be defined');
}
if (!process.env.PGUSER) {
  throw new Error('Database user must be defined');
}
if (!process.env.PGHOST) {
  throw new Error('Database host must be defined');
}

if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID must be defined');
}

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID must be defined');
}

if (!process.env.NATS_URI) {
  throw new Error('NATS_URI must be defined');
}

const start = async () => {
  try {
    await pgPool.connect({
      database: process.env.PGDATABASE,
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      port: 5432,
    });

    // TODO: FIX THIS - USE PG SCHEMA MIGRATIONS INSTEAD
    pgPool._pool?.on('connect', (client) => {
      client
        .query(
          `CREATE TABLE IF NOT EXISTS data 
          (id SERIAL PRIMARY KEY, awayScored INT NOT NULL,homeScored INT NOT NULL,
            homeTeam VARCHAR(20) NOT NULL,awayTeam VARCHAR(20) NOT NULL,
            matchDay TIMESTAMP WITH TIME ZONE NOT NULL,referee VARCHAR(20) NOT NULL,
            winner VARCHAR(10) NOT NULL,season INT NOT NULL);`
        )
        .catch((err) => {
          throw err;
        });
    });

    await natsWraper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URI!
    );

    natsWraper.client.on('close', () => {
      console.log('NATS shutting down . . .');
      process.exit();
    });

    process.on('SIGINT', () => natsWraper.client.close());
    process.on('SIGTERM', () => natsWraper.client.close());

    new DataUploadedListener(natsWraper.client).listen();

    app.listen(5002);
    console.log('Connected to Data Service, listening on PORT: 5002');
  } catch (error) {
    console.log(error);
  }
};

start();

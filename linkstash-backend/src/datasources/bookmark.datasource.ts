import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';

dotenv.config();

const dbType = process.env.DB_TYPE ?? 'mysql';

// Define different configurations based on the selected DB type
const dbConfigs: Record<string, object> = {
  mysql: {
    name: 'bookmark',
    connector: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    collation: process.env.DB_COLLATION,
  },
  sqlite: {
    name: 'bookmark',
    connector: 'sqlite3',
    file: process.env.DB_FILE || 'database.sqlite', // SQLite database file path
  },
};

// Select the appropriate configuration
const config = dbConfigs[dbType] || dbConfigs.mysql;

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully.
@lifeCycleObserver('datasource')
export class BookmarkDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'bookmark';
  constructor(
    @inject('datasources.config.bookmark', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

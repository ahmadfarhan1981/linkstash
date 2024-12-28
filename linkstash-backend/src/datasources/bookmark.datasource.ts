import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv'

dotenv.config()
const config = {
  name: 'bookmark',
  connector: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  collation: process.env.DB_COLLATION, 
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
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

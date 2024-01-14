import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'bookmark',
  connector: 'mysql',
  url: 'mysql://root:example@localhost:3306/linkstash_backend',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
  database: 'linkstash_backend',
  file: './data/db.json',
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
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.bookmark', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

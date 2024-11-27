import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'linkding',
  connector: 'rest',
  baseURL: 'https://linkding.ahmadfarhan.com',
  crud: false,
  options: {

  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'https://linkding.ahmadfarhan.com/api/bookmarks',
        headers: {
          'Authorization': 'Token {token}',
        },
        query:{
          limit: '{limit:number}',
          offset: '{offset:number}'
        }

      },
      functions: {
        getBookmarks: ['token', 'limit', 'offset' ],
      },
    },
  ],

};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class LinkdingDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'linkding';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.linkding', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

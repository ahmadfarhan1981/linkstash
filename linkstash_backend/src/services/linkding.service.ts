import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {LinkdingDataSource} from '../datasources';

export interface Linkding {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getBookmarks(token:string, limit:number, offset:number):Promise<Object>;
}

export class LinkdingProvider implements Provider<Linkding> {
  constructor(
    // linkding must match the name property in the datasource json file
    @inject('datasources.linkding')
    protected dataSource: LinkdingDataSource = new LinkdingDataSource(),
  ) {}

  value(): Promise<Linkding> {
    return getService(this.dataSource);
  }
}

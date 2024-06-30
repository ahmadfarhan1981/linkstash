import {inject} from '@loopback/core';
import {DefaultTransactionalRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Asset, AssetRelations} from '../models';

export class AssetRepository extends DefaultTransactionalRepository<
  Asset,
  typeof Asset.prototype.AssetID,
  AssetRelations
> {
  constructor(@inject('datasources.bookmark') dataSource: BookmarkDataSource) {
    super(Asset, dataSource);
  }
}

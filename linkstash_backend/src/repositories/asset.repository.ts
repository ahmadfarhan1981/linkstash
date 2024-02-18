import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Asset, AssetRelations} from '../models';

export class AssetRepository extends DefaultCrudRepository<
  Asset,
  typeof Asset.prototype.AssetID,
  AssetRelations
> {
  constructor(@inject('datasources.bookmark') dataSource: BookmarkDataSource) {
    super(Asset, dataSource);
  }
}

import {inject} from '@loopback/core';
import {DefaultTransactionalRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {UserPermissions, UserPermissionsRelations} from '../models';

export class UserPermissionsRepository extends DefaultTransactionalRepository<UserPermissions, typeof UserPermissions.prototype.userId, UserPermissionsRelations> {
  constructor(@inject('datasources.bookmark') dataSource: BookmarkDataSource) {
    super(UserPermissions, dataSource);
  }
}

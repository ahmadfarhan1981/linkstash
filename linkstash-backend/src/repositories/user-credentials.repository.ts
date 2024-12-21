import {inject} from '@loopback/core';
import {DefaultCrudRepository, DefaultTransactionalRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {UserCredentials, UserCredentialsRelations} from '../models';

export class UserCredentialsRepository extends DefaultTransactionalRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource,
  ) {
    super(UserCredentials, dataSource);
  }
}

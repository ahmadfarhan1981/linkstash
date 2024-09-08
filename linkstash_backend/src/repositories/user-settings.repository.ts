import {inject} from '@loopback/core';
import {DefaultCrudRepository, DefaultTransactionalRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {UserSettings, UserSettingsRelations} from '../models';

export class UserSettingsRepository extends DefaultTransactionalRepository<
  UserSettings,
  typeof UserSettings.prototype.userId,
  UserSettingsRelations
> {
  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource,
  ) {
    super(UserSettings, dataSource);
  }
}

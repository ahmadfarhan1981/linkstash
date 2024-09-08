// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {DefaultTransactionalRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, juggler, repository} from '@loopback/repository';
import {UserServiceBindings} from '../bindings/UserService.binding';
import {Bookmark, LinkstashUser, Tag, UserCredentials, UserRelations, UserSettings} from '../models';
import {BookmarkRepository} from './bookmark.repository';
import {TagRepository} from './tag.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserSettingsRepository} from './user-settings.repository';

export class LinkstashUserRepository extends DefaultTransactionalRepository<LinkstashUser, typeof LinkstashUser.prototype.id, UserRelations> {
  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof LinkstashUser.prototype.id>;

  public readonly bookmarks: HasManyRepositoryFactory<Bookmark, typeof LinkstashUser.prototype.id>;

  public readonly tags: HasManyRepositoryFactory<Tag, typeof LinkstashUser.prototype.id>;

  public readonly userSettings: HasOneRepositoryFactory<UserSettings, typeof LinkstashUser.prototype.id>;

  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`) dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('BookmarkRepository') protected bookmarkRepositoryGetter: Getter<BookmarkRepository>,
    @repository.getter('TagRepository') protected tagRepositoryGetter: Getter<TagRepository>, @repository.getter('UserSettingsRepository') protected userSettingsRepositoryGetter: Getter<UserSettingsRepository>,
  ) {
    super(LinkstashUser, dataSource);
    this.userSettings = this.createHasOneRepositoryFactoryFor('userSettings', userSettingsRepositoryGetter);
    this.registerInclusionResolver('userSettings', this.userSettings.inclusionResolver);

    this.bookmarks = this.createHasManyRepositoryFactoryFor('bookmarks', bookmarkRepositoryGetter);
    this.registerInclusionResolver('bookmarks', this.bookmarks.inclusionResolver);

    this.tags = this.createHasManyRepositoryFactoryFor('tags', tagRepositoryGetter);
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);

    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredentials(userId: typeof LinkstashUser.prototype.id): Promise<UserCredentials | undefined> {
    return this.userCredentials(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }
}

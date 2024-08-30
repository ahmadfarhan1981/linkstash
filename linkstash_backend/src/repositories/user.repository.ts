// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {DefaultTransactionalRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, juggler, repository} from '@loopback/repository';
import {Bookmark, Tag, LinkStashUser, UserCredentials, UserRelations} from '../models';
import {BookmarkRepository} from './bookmark.repository';
import {TagRepository} from './tag.repository';
import {UserServiceBindings} from '../bindings/UserService.binding';
import {UserCredentialsRepository} from './user-credentials.repository';



export class UserRepository extends DefaultTransactionalRepository<LinkStashUser, typeof LinkStashUser.prototype.id, UserRelations> {
  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof LinkStashUser.prototype.id>;

  public readonly bookmarks: HasManyRepositoryFactory<Bookmark, typeof LinkStashUser.prototype.id>;

  public readonly tags: HasManyRepositoryFactory<Tag, typeof LinkStashUser.prototype.id>;

  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`) dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('BookmarkRepository') protected bookmarkRepositoryGetter: Getter<BookmarkRepository>,
    @repository.getter('TagRepository') protected tagRepositoryGetter: Getter<TagRepository>,
  ) {
    super(LinkStashUser, dataSource);

    this.bookmarks = this.createHasManyRepositoryFactoryFor('bookmarks', bookmarkRepositoryGetter);
    this.registerInclusionResolver('bookmarks', this.bookmarks.inclusionResolver);

    this.tags = this.createHasManyRepositoryFactoryFor('tags', tagRepositoryGetter);
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);

    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredentials(userId: typeof LinkStashUser.prototype.id): Promise<UserCredentials | undefined> {
    return this.userCredentials(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }
}

import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Bookmark, BookmarkRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class BookmarkRepository extends DefaultCrudRepository<
  Bookmark,
  typeof Bookmark.prototype.id,
  BookmarkRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Bookmark.prototype.id>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Bookmark, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

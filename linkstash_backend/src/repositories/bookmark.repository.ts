import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, DefaultTransactionalRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Bookmark, BookmarkRelations, User, Archive} from '../models';
import {UserRepository} from './user.repository';
import {ArchiveRepository} from './archive.repository';

export class BookmarkRepository extends DefaultCrudRepository<
  Bookmark,
  typeof Bookmark.prototype.id,
  BookmarkRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Bookmark.prototype.id>;

  public readonly archives: HasManyRepositoryFactory<Archive, typeof Bookmark.prototype.id>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ArchiveRepository') protected archiveRepositoryGetter: Getter<ArchiveRepository>,
  ) {
    super(Bookmark, dataSource);
    this.archives = this.createHasManyRepositoryFactoryFor('archives', archiveRepositoryGetter,);
    this.registerInclusionResolver('archives', this.archives.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

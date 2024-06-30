import {Getter, inject} from '@loopback/core';
import {DefaultTransactionalRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Archive, Bookmark, BookmarkRelations} from '../models';
import {ArchiveRepository} from './archive.repository';
import {UserRepository} from './user.repository';

export class BookmarkRepository extends DefaultTransactionalRepository<Bookmark, typeof Bookmark.prototype.id, BookmarkRelations> {
  public readonly archives: HasManyRepositoryFactory<Archive, typeof Bookmark.prototype.id>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('ArchiveRepository') protected archiveRepositoryGetter: Getter<ArchiveRepository>,
  ) {
    super(Bookmark, dataSource);
    this.archives = this.createHasManyRepositoryFactoryFor('archives', archiveRepositoryGetter);
    this.registerInclusionResolver('archives', this.archives.inclusionResolver);
  }
}

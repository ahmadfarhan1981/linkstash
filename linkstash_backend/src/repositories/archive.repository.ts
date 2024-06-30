import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor, DefaultTransactionalRepository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Archive, ArchiveRelations, Bookmark} from '../models';
import {BookmarkRepository} from './bookmark.repository';

export class ArchiveRepository extends DefaultTransactionalRepository<
  Archive,
  typeof Archive.prototype.ArchiveId,
  ArchiveRelations
> {

  public readonly bookmark: BelongsToAccessor<Bookmark, typeof Archive.prototype.ArchiveId>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource, @repository.getter('BookmarkRepository') protected bookmarkRepositoryGetter: Getter<BookmarkRepository>,
  ) {
    super(Archive, dataSource);
    this.bookmark = this.createBelongsToAccessorFor('bookmark', bookmarkRepositoryGetter,);
    this.registerInclusionResolver('bookmark', this.bookmark.inclusionResolver);
  }
}

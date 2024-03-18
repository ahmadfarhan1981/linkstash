import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {BookmarkTag, BookmarkTagRelations, Bookmark, Tag} from '../models';
import {BookmarkRepository} from './bookmark.repository';
import {TagRepository} from './tag.repository';

export class BookmarkTagRepository extends DefaultCrudRepository<
  BookmarkTag,
  typeof BookmarkTag.prototype.Id,
  BookmarkTagRelations
> {

  public readonly bookmark: BelongsToAccessor<Bookmark, typeof BookmarkTag.prototype.Id>;

  public readonly tag: BelongsToAccessor<Tag, typeof BookmarkTag.prototype.Id>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource, @repository.getter('BookmarkRepository') protected bookmarkRepositoryGetter: Getter<BookmarkRepository>, @repository.getter('TagRepository') protected tagRepositoryGetter: Getter<TagRepository>,
  ) {
    super(BookmarkTag, dataSource);
    this.tag = this.createBelongsToAccessorFor('tag', tagRepositoryGetter,);
    this.registerInclusionResolver('tag', this.tag.inclusionResolver);
    this.bookmark = this.createBelongsToAccessorFor('bookmark', bookmarkRepositoryGetter,);
    this.registerInclusionResolver('bookmark', this.bookmark.inclusionResolver);
  }
}

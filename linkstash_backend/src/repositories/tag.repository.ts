import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, ReferencesManyAccessor, repository} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Bookmark, Tag, TagRelations} from '../models';
import {BookmarkRepository} from './bookmark.repository';
import {UserRepository} from './user.repository';

export class TagRepository extends DefaultCrudRepository<Tag, typeof Tag.prototype.id, TagRelations> {
  public readonly bookmarks: ReferencesManyAccessor<Bookmark, typeof Tag.prototype.id>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('BookmarkRepository') protected bookmarkRepositoryGetter: Getter<BookmarkRepository>,
  ) {
    super(Tag, dataSource);
    this.bookmarks = this.createReferencesManyAccessorFor('bookmarks', bookmarkRepositoryGetter);
  }
}

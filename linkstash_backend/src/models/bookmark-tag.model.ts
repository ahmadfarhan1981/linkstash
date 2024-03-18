import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Tag, TagWithRelations} from './';
import {Bookmark} from './bookmark.model';

@model()
export class BookmarkTag extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  Id?: number;

  @belongsTo(() => Bookmark, {}, {mysql: {index: {kind: 'INDEX'}}})
  bookmarkId: number;

  @belongsTo(() => Tag)
  tagId: number;

  constructor(data?: Partial<BookmarkTag>) {
    super(data);
  }
}

export interface BookmarkTagRelations {
  // describe navigational properties here
  tag?: TagWithRelations;
}

export type BookmarkTagWithRelations = BookmarkTag & BookmarkTagRelations;

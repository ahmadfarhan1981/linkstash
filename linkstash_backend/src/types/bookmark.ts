import {BookmarkWithRelations, Tag} from '../models';

export type BookmarkWithTags = Partial<BookmarkWithRelations> & {tags: Tag[]};

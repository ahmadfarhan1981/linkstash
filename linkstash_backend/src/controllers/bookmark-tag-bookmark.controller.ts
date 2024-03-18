import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  BookmarkTag,
  Bookmark,
} from '../models';
import {BookmarkTagRepository} from '../repositories';

export class BookmarkTagBookmarkController {
  constructor(
    @repository(BookmarkTagRepository)
    public bookmarkTagRepository: BookmarkTagRepository,
  ) { }

  @get('/bookmark-tags/{id}/bookmark', {
    responses: {
      '200': {
        description: 'Bookmark belonging to BookmarkTag',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bookmark),
          },
        },
      },
    },
  })
  async getBookmark(
    @param.path.number('id') id: typeof BookmarkTag.prototype.Id,
  ): Promise<Bookmark> {
    return this.bookmarkTagRepository.bookmark(id);
  }
}

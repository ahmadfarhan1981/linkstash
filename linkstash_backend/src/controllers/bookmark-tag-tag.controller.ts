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
  Tag,
} from '../models';
import {BookmarkTagRepository} from '../repositories';

export class BookmarkTagTagController {
  constructor(
    @repository(BookmarkTagRepository)
    public bookmarkTagRepository: BookmarkTagRepository,
  ) { }

  @get('/bookmark-tags/{id}/tag', {
    responses: {
      '200': {
        description: 'Tag belonging to BookmarkTag',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tag),
          },
        },
      },
    },
  })
  async getTag(
    @param.path.number('id') id: typeof BookmarkTag.prototype.Id,
  ): Promise<Tag> {
    return this.bookmarkTagRepository.tag(id);
  }
}

import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Bookmark,
  User,
} from '../models';
import {BookmarkRepository} from '../repositories';

export class BookmarkUserController {
  constructor(
    @repository(BookmarkRepository)
    public bookmarkRepository: BookmarkRepository,
  ) { }

  @get('/bookmarks/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Bookmark',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Bookmark.prototype.id,
  ): Promise<User> {
    return this.bookmarkRepository.user(id);
  }
}

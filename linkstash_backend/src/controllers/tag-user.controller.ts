import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Tag,
  User,
} from '../models';
import {TagRepository} from '../repositories';

export class TagUserController {
  constructor(
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) { }

  @get('/tags/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Tag',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Tag.prototype.Id,
  ): Promise<User> {
    return this.tagRepository.user(id);
  }
}

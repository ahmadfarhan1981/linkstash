import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {Bookmark, User} from '../models';
import {UserRepository} from '../repositories';

export class UserBookmarkController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/users/{id}/bookmarks', {
    responses: {
      '200': {
        description: 'Array of User has many Bookmark',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Bookmark)},
          },
        },
      },
    },
  })
  async find(@param.path.string('id') id: string, @param.query.object('filter') filter?: Filter<Bookmark>): Promise<Bookmark[]> {
    return this.userRepository.bookmarks(id).find(filter);
  }

  @post('/users/{id}/bookmarks', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bookmark)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookmark, {
            title: 'NewBookmarkInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    bookmark: Omit<Bookmark, 'id'>,
  ): Promise<Bookmark> {
    return this.userRepository.bookmarks(id).create(bookmark);
  }

  @patch('/users/{id}/bookmarks', {
    responses: {
      '200': {
        description: 'User.Bookmark PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookmark, {partial: true}),
        },
      },
    })
    bookmark: Partial<Bookmark>,
    @param.query.object('where', getWhereSchemaFor(Bookmark)) where?: Where<Bookmark>,
  ): Promise<Count> {
    return this.userRepository.bookmarks(id).patch(bookmark, where);
  }

  @del('/users/{id}/bookmarks', {
    responses: {
      '200': {
        description: 'User.Bookmark DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(@param.path.string('id') id: string, @param.query.object('where', getWhereSchemaFor(Bookmark)) where?: Where<Bookmark>): Promise<Count> {
    return this.userRepository.bookmarks(id).delete(where);
  }
}

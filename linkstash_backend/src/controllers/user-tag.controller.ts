import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, post, requestBody, Response, RestBindings} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Tag} from '../models';
import {UserRepository} from '../repositories';
import {newTagSchema} from '../types/';

@authenticate('jwt')
export class UserTagController {
  constructor(@repository(UserRepository) protected userRepository: UserRepository) {}

  @get('/tags', {
    responses: {
      '200': {
        description: 'Tags belonging to the logged in user',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  async find(@inject(SecurityBindings.USER) currentUserProfile: UserProfile, @param.query.object('filter') filter?: Filter<Tag>): Promise<Tag[]> {
    return this.userRepository.tags(currentUserProfile[securityId]).find(filter);
  }

  @post('/tags', {
    responses: {
      '201': {
        description: 'Tag created',
        content: {'application/json': {schema: newTagSchema}},
      },
      '202': {
        description: 'Existing tag',
        content: {'application/json': {schema: newTagSchema}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {
            title: 'NewTagInUser',
            exclude: ['id', 'userId'],
          }),
        },
      },
    })
    tag: Omit<Tag, 'id' | 'userId'>,
  ): Promise<Omit<Tag, "id|'userId">> {
    const existing = await this.userRepository.tags(currentUserProfile[securityId]).find({
      where: {name: tag.name},
    });
    if (existing.length > 0) {
      res.status(202);
      return Promise.resolve(existing[0]);
    }
    res.status(201);
    return this.userRepository.tags(currentUserProfile[securityId]).create(tag);
  }

  @del('/tags', {
    responses: {
      '200': {
        description: "Number of user's tags deleted",
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.object('where', getWhereSchemaFor(Tag))
    where?: Where<Tag>,
  ): Promise<Count> {
    return this.userRepository.tags(currentUserProfile[securityId]).delete(where);
  }
}

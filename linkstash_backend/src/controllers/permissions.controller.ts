import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, getWhereSchemaFor, param, patch, requestBody} from '@loopback/rest';
import _ from 'lodash';
import {UserPermissions} from '../models';
import {LinkstashUserRepository} from '../repositories';

export class PermissionsController {
  constructor(@repository(LinkstashUserRepository) protected linkstashUserRepository: LinkstashUserRepository) {}

  @authenticate('jwt')
  @get('/users/{id}/permissions', {
    responses: {
      '200': {
        description: "Get user's permissions",
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserPermissions, {exclude: ['userId']}),
          },
        },
      },
    },
  })
  async get(@param.path.string('id') id: string): Promise<Omit<UserPermissions, 'userId'>> {
    const result = await this.linkstashUserRepository.userPermissions(id).get();
    return _.omit(result, 'userId');
  }

  @authenticate('jwt')
  @patch('/users/{id}/permissions', {
    responses: {
      '200': {
        description: "Update the user' permissions",
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserPermissions, {partial: true, exclude: ['userId']}),
        },
      },
    })
    userSettings: Partial<Omit<UserPermissions, 'userId'>>,
    @param.query.object('where', getWhereSchemaFor(UserPermissions)) where?: Where<UserPermissions>,
  ): Promise<Count> {
    return this.linkstashUserRepository.userPermissions(id).patch(userSettings, where);
  }
}

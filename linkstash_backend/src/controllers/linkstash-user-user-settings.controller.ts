import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  LinkstashUser,
  UserSettings,
} from '../models';
import {LinkstashUserRepository} from '../repositories';

export class LinkstashUserUserSettingsController {
  constructor(
    @repository(LinkstashUserRepository) protected linkstashUserRepository: LinkstashUserRepository,
  ) { }

  @get('/linkstash-users/{id}/user-settings', {
    responses: {
      '200': {
        description: 'LinkstashUser has one UserSettings',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserSettings),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserSettings>,
  ): Promise<UserSettings> {
    return this.linkstashUserRepository.userSettings(id).get(filter);
  }

  @post('/linkstash-users/{id}/user-settings', {
    responses: {
      '200': {
        description: 'LinkstashUser model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserSettings)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof LinkstashUser.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSettings, {
            title: 'NewUserSettingsInLinkstashUser',
            exclude: ['userId']
          }),
        },
      },
    }) userSettings: Omit<UserSettings, 'UserId'>,
  ): Promise<UserSettings> {
    return this.linkstashUserRepository.userSettings(id).create(userSettings);
  }

  @patch('/linkstash-users/{id}/user-settings', {
    responses: {
      '200': {
        description: 'LinkstashUser.UserSettings PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSettings, {partial: true}),
        },
      },
    })
    userSettings: Partial<UserSettings>,
    @param.query.object('where', getWhereSchemaFor(UserSettings)) where?: Where<UserSettings>,
  ): Promise<Count> {
    return this.linkstashUserRepository.userSettings(id).patch(userSettings, where);
  }

  @del('/linkstash-users/{id}/user-settings', {
    responses: {
      '200': {
        description: 'LinkstashUser.UserSettings DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserSettings)) where?: Where<UserSettings>,
  ): Promise<Count> {
    return this.linkstashUserRepository.userSettings(id).delete(where);
  }
}

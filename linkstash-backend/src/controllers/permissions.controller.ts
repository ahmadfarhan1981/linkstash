import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Count, CountSchema, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, patch, requestBody, response} from '@loopback/rest';
import {SecurityBindings, securityId} from '@loopback/security';
import _ from 'lodash';
import {UserPermissions} from '../models';
import {LinkstashUserRepository} from '../repositories';
import {PermissionsService} from '../services';
import {UserProfile} from '../types';
import {ForbiddenResponse, UnauthorizedResponse} from './responses';

export class PermissionsController {
  constructor(@repository(LinkstashUserRepository) protected linkstashUserRepository: LinkstashUserRepository) {}

  @authenticate('jwt')
  @response(401, UnauthorizedResponse)
  @response(403, ForbiddenResponse)
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
  async get(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @service(PermissionsService) permissionService: PermissionsService,
  ): Promise<Omit<UserPermissions, 'userId'>> {
    await permissionService.chcekIsAllowed(currentUserProfile[securityId], id);
    const result = await this.linkstashUserRepository.userPermissions(id).get();
    return _.omit(result, 'userId');
  }

  @authenticate('jwt')
  @response(401, UnauthorizedResponse)
  @response(403, ForbiddenResponse)
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
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @service(PermissionsService) permissionService: PermissionsService,
  ): Promise<Count> {
    await permissionService.chcekIsAllowed(currentUserProfile[securityId], ''); //
    return this.linkstashUserRepository.userPermissions(id).patch(userSettings);
  }

  @authenticate('jwt')
  @response(401, UnauthorizedResponse)
  @get('/users/me/permissions', {
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
  async getMine(@inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<Omit<UserPermissions, 'userId'>> {
    const result = await this.linkstashUserRepository.userPermissions(currentUserProfile[securityId]).get();
    return _.omit(result, 'userId');
  }
}

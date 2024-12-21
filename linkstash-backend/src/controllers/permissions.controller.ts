import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, patch, requestBody} from '@loopback/rest';
import _ from 'lodash';
import {UserPermissions} from '../models';
import {LinkstashUserRepository} from '../repositories';
import {inject, service} from '@loopback/core';
import {UserProfile} from '../types';
import {SecurityBindings, securityId} from '@loopback/security';
import {Linkding, PermissionsService} from '../services';

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
  async get(@param.path.string('id') id: string,@inject(SecurityBindings.USER) currentUserProfile: UserProfile, @service(PermissionsService) permissionService : PermissionsService ): Promise<Omit<UserPermissions, 'userId'>> {
    await permissionService.chcekIsAllowed(currentUserProfile[securityId], id)

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
    }
  ) userSettings: Partial<Omit<UserPermissions, 'userId'>>,
  @inject(SecurityBindings.USER) currentUserProfile: UserProfile, @service(PermissionsService) permissionService : PermissionsService

  ): Promise<Count> {
    const notAllowed = "Not allowed"
    const currentUserId = currentUserProfile[securityId]
    const isUserAdmin = await permissionService.isUserAdmin(currentUserId)
    if(isUserAdmin){
      throw new HttpErrors.Unauthorized(notAllowed);
    }
    return this.linkstashUserRepository.userPermissions(id).patch(userSettings);
  }

  @authenticate('jwt')
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




//   @get('/users/me/test', {
//     responses: {
//       '200': {
//         description: "Get user's permissions",
//         content: {

//         },
//       },
//     },
//   })
//   async test(@inject('services.Linkding') linkding : Linkding,
//   @param.query.string('token') token: string,
//   @param.query.number('limit') limit: number,
//   @param.query.number('offset') offset: number,
// ):Promise<Object> {
//     const x = await linkding.getBookmarks(token, limit, offset )
//     return x;
//   }


}









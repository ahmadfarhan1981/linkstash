// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import {IsolationLevel, model, property, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, post, requestBody, Response, response, RestBindings} from '@loopback/rest';
import {SecurityBindings, securityId} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {LinkstashUser} from '../models';
import {ArchiveRepository, LinkstashUserRepository, UserCredentialsRepository, UserPermissionsRepository} from '../repositories';
import {ArchiveService, LinkStashUserService} from '../services';
import {ChangePasswordRequestBody, Credentials, CredentialsRequestBody, UserProfile} from '../types';

@model()
export class NewUserRequest extends LinkstashUser {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class ChangePasswordRequest {
  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;
}
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: LinkStashUserService,
    @repository(LinkstashUserRepository) protected userRepository: LinkstashUserRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile | undefined,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': LinkstashUser,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<LinkstashUser> {
    const password = await hash(newUserRequest.password, await genSalt());
    const transaction = await this.userRepository.beginTransaction();
    const savedUser = await this.userRepository.create(_.omit(newUserRequest, 'password'), transaction);
    await this.userRepository.userCredentials(savedUser.id).create({password}, transaction);
    await this.userRepository.userPermissions(savedUser.id).create({isUserAdmin: false}, transaction);
    await transaction.commit();
    return savedUser;
  }

  @authenticate('jwt')
  @get('/users', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(LinkstashUser, {includeRelations: false}),
            },
          },
        },
      },
    },
  })
  async getUsers(@inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<LinkstashUser[]> {
    return this.userRepository.find();
  }

  @authenticate('jwt')
  @get('/change-password', {
    responses: {
      '204': {},
    },
  })
  async changePassword(
    @requestBody(ChangePasswordRequestBody) changePasswordRequest: ChangePasswordRequest,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<undefined> {
    const currentUserId = currentUserProfile[securityId];
    const isUserAdmin = (await this.userRepository.userPermissions(currentUserId).get()).isUserAdmin;
    const newPassword = await hash(changePasswordRequest.newPassword, await genSalt());
    if (changePasswordRequest.userId === currentUserProfile[securityId] || isUserAdmin) {
      await this.userRepository.userCredentials(changePasswordRequest.userId).patch({password: newPassword});
    } else {
      throw new HttpErrors.Forbidden('Unauthorized');
    }
  }

  @authenticate('jwt')
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
    @service(ArchiveService) archiveService: ArchiveService,
    @repository(UserCredentialsRepository) credentialsRepository: UserCredentialsRepository,
    @repository(UserPermissionsRepository) permissionsRepository: UserPermissionsRepository,
  ): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (existing) {
      /**
       * TODO figure out safer way to do deletion.
       *
       * This is optimistic, it assumes nothing will go wrong during deletion.
       *
       * Currently it has to be before the transaction becuase it still query the DB to get all
       * the asset that needs to be deleted.
       *
       * Need to cache it somewhere so that we can delete it after transaction is completed
       *
       **/
      await archiveService.removeLocalAssetByUser(id);
      const transaction = await this.userRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
      await this.userRepository.bookmarks(id).delete({}, {transaction});
      await this.userRepository.tags(id).delete({}, {transaction});
      await archiveRepository.deleteAll({UserId: id}, transaction);
      await credentialsRepository.deleteAll({userId: id}, transaction);
      await permissionsRepository.deleteAll({userId: id}, transaction);
      await this.userRepository.deleteById(id, {transaction});
      await transaction.commit();
    } else {
      res.status(404);
      throw new Error(`Entity not found: User with id ${id}`);
    }

    //await this.bookmarkRepository.deleteById(id);
  }
}

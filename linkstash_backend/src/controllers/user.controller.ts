// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {LinkstashUser} from '../models';
import {LinkstashUserRepository} from '../repositories';
import {LinkStashUserService} from '../services';
import {Credentials, CredentialsRequestBody, UserProfile} from '../types';

@model()
export class NewUserRequest extends LinkstashUser {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class ChangePasswordRequest{
  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;

  @property({
    type: 'string',
    required: true,
  })
  userId : string;
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
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
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
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );
    await this.userRepository.userCredentials(savedUser.id).create({password});
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
      }
    },
  })
  async getUsers(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<LinkstashUser[]> {

    return this.userRepository.find()
  }

  @authenticate('jwt')
  @get('/change-password', {
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
      }
    },
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangePasswordRequest, {
            title: 'Change password details',
          }),
        },
      },
    })
    changePasswordRequest: ChangePasswordRequest,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<LinkstashUser[]> {
    const isUserAdmin = true;
    if(changePasswordRequest.userId === currentUserProfile[securityId] || isUserAdmin){
      console.log("as")
    }
    return this.userRepository.find()
  }




}

import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {LinkstashUser} from '../models';
import {Credentials} from '../types';

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<LinkstashUser, Credentials>>('services.user.service');
  export const DATASOURCE_NAME = 'jwtdb';
  export const USER_REPOSITORY = 'repositories.LinkstashUserRepository';
  export const USER_CREDENTIALS_REPOSITORY = 'repositories.UserCredentialsRepository';
}

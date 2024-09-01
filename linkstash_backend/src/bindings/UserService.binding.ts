import {BindingKey} from '@loopback/core';
import {LinkStashUser} from '../models';
import {UserService} from '@loopback/authentication';
import {Credentials} from '../types';

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<LinkStashUser, Credentials>>(
    'services.user.service',
  );
  export const DATASOURCE_NAME = 'jwtdb';
  export const USER_REPOSITORY = 'repositories.UserRepository';
  export const USER_CREDENTIALS_REPOSITORY =
    'repositories.UserCredentialsRepository';
}
import {SchemaObject, getModelSchemaRef} from '@loopback/rest';

import {Bookmark} from '../models';

export const newTagSchema = {
  title: 'New tag option',
  description: 'Options for creating a new tag',
  properties: {
    name: {type: 'string', description: 'The name of the tag to create'},
  },
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
      // minLength: 8,
    },
  },
};

const ChangePasswordSchema: SchemaObject = {
  type: 'object',
  required: ['userId', 'newPassword'],
  properties: {
    userId: {
      type: 'string',
    },
    newPassword: {
      type: 'string',
      // minLength: 8,
    },
  },
};

export const ChangePasswordRequestBody = {
  description: 'The input of change password',
  required: true,
  content: {
    'application/json': {schema: ChangePasswordSchema},
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export const bookmarkPatchSchema = getModelSchemaRef(Bookmark, {title: 'Bookmark patch schema', partial: true, exclude: ['userId', 'id', 'archiveCount']});

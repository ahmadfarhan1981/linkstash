import {RequestBodyObject, SchemaObject, getModelSchemaRef} from '@loopback/rest';

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

export const bulkDeleteSchema: SchemaObject = {
  title: 'Bulk delete schema',
  description: 'Schema for bulk delete request body',
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      description: 'List of IDs to delete',
      items: { type: 'string' },
    },
  },
  required: ['ids'],
  example: {
    ids: ["123", "456", "789"]
  }
};


export const bulkDeleteResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Bulk delete response',
  properties: {
    success: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of successfully deleted IDs',
    },
    failure: {
      description: 'List of failed deletions',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID of the item that failed to delete' },
          message: { type: 'string', description: 'Reason for failure' },
        },
      },
    },
  },
  example:{
        success: ["4"],
        failure: [
          { id: "999", message: "not_found" },
          { id: "988", message: "not_found" }
        ]
      }
};

export const bulkDeleteRequestBody: RequestBodyObject = {
  description: 'Bulk delete request body',
  required: true,
  content: {
    'application/json': {
      schema: bulkDeleteSchema,
    },
  },
};

export type BulkDeleteResponse = {
  success: string[],
  failure: {id: string, message: string}[],
};

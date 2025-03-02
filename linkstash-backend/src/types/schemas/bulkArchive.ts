import {RequestBodyObject, SchemaObject} from '@loopback/rest';
import {Result} from '../utils';

export const bulkArchiveSchema: SchemaObject = {
  type: 'object',
  title: 'Bulk add tag request body',
  description: 'Bulk add tag request body',
  properties: {
    bookmarkIds: {
      type: 'array',
      items: {
        type: 'string',
        description: 'List of bookmarks to archive',
      }
    }
  },
};
export const bulkArchiveRequestBody: RequestBodyObject = {
  description: 'Bulk add tag request body',
  required: true,
  content: {
    'application/json': {
      schema: bulkArchiveSchema,
    },
  },

};
export const bulkArchiveResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Bulk archive response',
  properties: {
    success: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          message: {type: 'string'}
        },
      },
      description: 'List of successfully archive requests',
    },
    failure: {
      description: 'List of failed archive requests',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          message: {type: 'string'}
        },
      }
    },
  }
};

export type BulkArchiveResult = {
  success: (Result & { bookmarkId: string })[] ,
  failure: (Result & { bookmarkId: string })[] ,
};
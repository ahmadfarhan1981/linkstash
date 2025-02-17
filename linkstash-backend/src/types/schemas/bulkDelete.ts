import {RequestBodyObject, SchemaObject} from '@loopback/rest';

export const bulkDeleteSchema: SchemaObject = {
  title: 'Bulk delete schema',
  description: 'Schema for bulk delete request body',
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      description: 'List of IDs to delete',
      items: {type: 'string'},
    },
  },
  required: ['ids'],
  example: {
    ids: ['123', '456', '789'],
  },
};
export const bulkDeleteResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Bulk delete response',
  properties: {
    success: {
      type: 'array',
      items: {type: 'string'},
      description: 'List of successfully deleted IDs',
    },
    failure: {
      description: 'List of failed deletions',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string', description: 'ID of the item that failed to delete'},
          message: {type: 'string', description: 'Reason for failure'},
        },
      },
    },
  },
  example: {
    success: ['4'],
    failure: [
      {id: '999', message: 'not_found'},
      {id: '988', message: 'not_found'},
    ],
  },
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
import {RequestBodyObject, SchemaObject} from '@loopback/rest';

export const bulkTagRemoveSchema: SchemaObject = {
  type: 'object',
  title: 'Bulk delete tag request body',
  description: 'Bulk delete tag request body',
  properties: {
    bookmarkIds: {
      type: 'array',
      items: {
        type: 'string',
        description: 'List of bookmarks to remove the tags from',
      },
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        description: 'List tags to remove from the bookmarks',
      },
    },
  },
};
export const bulkTagRemoveRequestBody: RequestBodyObject = {
  description: 'Bulk delete tag request body',
  required: true,
  content: {
    'application/json': {
      schema: bulkTagRemoveSchema,
    },
  },

};
export const bulkTagRemoveResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Bulk tag remove response',
  properties: {
    success: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          tag: {type: 'string'},
        },
      },
      description: 'List of successfully removed tags from bookmarks',
    },
    failure: {
      description: 'List of failed tag remove',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bookmarkId: {type: 'string', description: 'ID of the bookmark'},
          tag: {type: 'string', description: 'The tag name'},
          message: {type: 'string', description: 'Reason for failure'},
        },
      },
    },
  },
  example: {
    success: [{bookmarkId:'4', tag:"react"}],
    failure: [
      {bookmarkId: '999', tag:"research", message: 'Bookmark not found'},
      {bookmarkId: '998', tag:"research1", message: 'Tag not found'},
    ],
  },
};

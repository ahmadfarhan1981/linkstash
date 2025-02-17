import {RequestBodyObject, SchemaObject} from '@loopback/rest';

export const bulkTagAddSchema: SchemaObject = {
  type: 'object',
  title: 'Bulk add tag request body',
  description: 'Bulk add tag request body',
  properties: {
    bookmarkIds: {
      type: 'array',
      items: {
        type: 'string',
        description: 'List of bookmarks to apply the tags to',
      },
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        description: 'List tags to apply to the bookmarks',
      },
    },
  },
};
export const bulkTagAddRequestBody: RequestBodyObject = {
  description: 'Bulk add tag request body',
  required: true,
  content: {
    'application/json': {
      schema: bulkTagAddSchema,
    },
  },

};
export const bulkTagAddResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Bulk tag add response',
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
      description: 'List of successfully added tags to bookmarks',
    },
    failure: {
      description: 'List of failed tag add',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bookmarkId: {type: 'string', description: 'ID of the bookmark'},
          tag: {type: 'string', description: 'The tag name'},
        },
      },
    },
  },
  example: {
    success: [{bookmarkId:'7', tag:"react"}],
    failure: [
      {bookmarkId: '999', tag:"research", message: 'Bookmark not found'},
      {bookmarkId: '998', tag:"research1", message: 'Tag not found'},
    ],
  },
};

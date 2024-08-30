import {getModelSchemaRef, SchemaObject} from '@loopback/rest';
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
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};


export const bookmarkPatchSchema = getModelSchemaRef(Bookmark, {title: 'Bookmark patch schema', partial: true, exclude: ['userId', 'id']});

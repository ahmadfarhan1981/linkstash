import {SchemaObject} from '@loopback/rest';

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
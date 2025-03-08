export const GenericErrorResponse = (statusCode: number, description:string, name: string, message: string) => ({
  description: `${description}`,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              statusCode: {type: 'integer', example: statusCode},
              name: {type: 'string', example: name},
              message: {type: 'string', example: message},
            },
            required: ['statusCode', 'name', 'message'],
          },
        },
        required: ['error'],
      },
    },
  },
});

export const NotFoundResponse = GenericErrorResponse (404, 'Resource not found', "NotFoundError", 'Resource not found.')
export const UnauthorizedResponse = GenericErrorResponse (401, 'Error Unauthorized', "UnauthorizedError", 'Authorization header not found.')
export const ForbiddenResponse = GenericErrorResponse (403, 'Error: Forbidden', "ForbiddenError", 'Not allowed.')

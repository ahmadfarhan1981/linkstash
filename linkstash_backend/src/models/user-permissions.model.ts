import {Entity, model, property} from '@loopback/repository';

@model()
export class UserPermissions extends Entity {
  @property({
    type: 'boolean',
    required: true,
  })
  isUserAdmin: boolean;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    index: {
      unique: true,
    },
  })
  userId: string;

  constructor(data?: Partial<UserPermissions>) {
    super(data);
  }
}

export interface UserPermissionsRelations {
  // describe navigational properties here
}

export type UserPermissionsWithRelations = UserPermissions & UserPermissionsRelations;

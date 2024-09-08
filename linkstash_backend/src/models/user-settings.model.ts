import {Entity, model, property} from '@loopback/repository';

@model()
export class UserSettings extends Entity {
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

  constructor(data?: Partial<UserSettings>) {
    super(data);
  }
}

export interface UserSettingsRelations {
  // describe navigational properties here
}

export type UserSettingsWithRelations = UserSettings & UserSettingsRelations;

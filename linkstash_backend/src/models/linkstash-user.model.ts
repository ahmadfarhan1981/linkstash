// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Bookmark} from './bookmark.model';
import {Tag} from './tag.model';
import {UserCredentials} from './user-credentials.model';
import {UserSettings} from './user-settings.model';

@model({
  settings: {
  },
})
export class LinkstashUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  username?: string;

  @hasMany(() => Bookmark, {keyTo: 'userId'})
  bookmarks: Bookmark[];

  @hasMany(() => Tag, {keyTo: 'userId'})
  tags: Tag[];

  @hasOne(() => UserCredentials, {keyTo: 'userId'})
  userCredentials: UserCredentials;

  @hasOne(() => UserSettings, {keyTo: 'userId'})
  userSettings: UserSettings;

  constructor(data?: Partial<LinkstashUser>) {
    super(data);
  }
}
export interface UserRelations {
  // describe navigational properties here
}
export type LinkStashUserWithRelations = LinkstashUser & UserRelations;

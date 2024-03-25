import {Entity, model, property, referencesMany} from '@loopback/repository';
import {Bookmark} from './bookmark.model';

@model()
export class Tag extends Entity {
  @property({type: 'number', id: true, generated: true}) id?: number;
  @property({type: 'string', required: true, index: true}) name: string;
  @referencesMany(() => Bookmark, {keyTo: 'id'}) bookmarkIds: number[];
  @property({type: 'string', required: true, index: true}) userId: string;

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}

export interface TagRelations {
  // describe navigational properties here
}

export type TagWithRelations = Tag & TagRelations;

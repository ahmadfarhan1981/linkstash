import {Entity, belongsTo, model, property} from '@loopback/repository';
import {User} from './';

@model()
export class Tag extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: true,
  })
  name: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}

export interface TagRelations {
  // describe navigational properties here
}

export type TagWithRelations = Tag & TagRelations;

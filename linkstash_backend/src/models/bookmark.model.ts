import {Entity, belongsTo, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Bookmark extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Bookmark>) {
    super(data);
  }
}

export interface BookmarkRelations {
  // describe navigational properties here
}

export type BookmarkWithRelations = Bookmark & BookmarkRelations;

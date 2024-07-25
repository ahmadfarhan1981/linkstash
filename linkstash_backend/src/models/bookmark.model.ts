import {Count, Entity, hasMany, model, property} from '@loopback/repository';
import {Archive} from './archive.model';

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

  @property.array(String)
  tagList?: string[];

  @property({
    type: 'string',
  })
  userId: string;

  @property({
    type: 'object',
  })
  archiveCount: Count;

  @hasMany(() => Archive)
  archives: Archive[];

  constructor(data?: Partial<Bookmark>) {
    super(data);
  }
}

export interface BookmarkRelations {
  // describe navigational properties here
}

export type BookmarkWithRelations = Bookmark & BookmarkRelations;

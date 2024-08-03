import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Bookmark} from './bookmark.model';

@model()
export class Archive extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  ArchiveId: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  Version: number;

  @property({
    type: 'date',
    required: true,
  })
  DateRetrieved: string;

  @property({
    type: 'date',
    required: true,
  })
  LastChecked: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
    mysql: {
      dataType: 'char',
      dataLength: 64,
    },
  })
  Hash: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  Filesize: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  CollisionId: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
    mysql: {dataType: 'LONGBLOB'},
  })
  Content: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
    mysql: {dataType: 'LONGBLOB'},
  })
  ContentBeforeProcess: string;

  @belongsTo(() => Bookmark)
  bookmarkId: number;

  constructor(data?: Partial<Archive>) {
    super(data);
  }
}

export interface ArchiveRelations {
  // describe navigational properties here
}

export type ArchiveWithRelations = Archive & ArchiveRelations;

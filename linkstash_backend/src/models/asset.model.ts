import {Entity, model, property} from '@loopback/repository';

@model()
export class Asset extends Entity {
  @property({
    type: 'string',
    required: true,
    id: true,
    generated: false,
  })
  AssetID: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  Hash: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  FileSize: number;

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
  })
  Type: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  Extension: string;

  constructor(data?: Partial<Asset>) {
    super(data);
  }
}

export interface AssetRelations {
  // describe navigational properties here
}

export type AssetWithRelations = Asset & AssetRelations;

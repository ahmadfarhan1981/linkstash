import {getModelSchemaRef} from '@loopback/rest';
import {Bookmark} from '../models';

export const newTagSchema = {
  title: 'New tag option',
  description: 'Options for creating a new tag',
  properties: {
    name: {type: 'string', description: 'The name of the tag to create'},
  },
};

export const bookmarkPatchSchema = getModelSchemaRef(Bookmark, {title: 'Bookmark patch schema', partial: true, exclude: ['userId', 'id']});

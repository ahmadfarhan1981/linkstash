// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Bookmarks, BookmarksData, BookmarksPatch, BookmarksQuery } from './bookmarks.schema'

export type { Bookmarks, BookmarksData, BookmarksPatch, BookmarksQuery }

export interface BookmarksParams extends KnexAdapterParams<BookmarksQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class BookmarksService<ServiceParams extends Params = BookmarksParams> extends KnexService<
  Bookmarks,
  BookmarksData,
  BookmarksParams,
  BookmarksPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'bookmarks'
  }
}

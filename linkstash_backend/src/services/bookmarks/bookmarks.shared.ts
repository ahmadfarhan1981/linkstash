// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Bookmarks,
  BookmarksData,
  BookmarksPatch,
  BookmarksQuery,
  BookmarksService
} from './bookmarks.class'

export type { Bookmarks, BookmarksData, BookmarksPatch, BookmarksQuery }

export type BookmarksClientService = Pick<
  BookmarksService<Params<BookmarksQuery>>,
  (typeof bookmarksMethods)[number]
>

export const bookmarksPath = 'bookmarks'

export const bookmarksMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const bookmarksClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(bookmarksPath, connection.service(bookmarksPath), {
    methods: bookmarksMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [bookmarksPath]: BookmarksClientService
  }
}

// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  bookmarksDataValidator,
  bookmarksPatchValidator,
  bookmarksQueryValidator,
  bookmarksResolver,
  bookmarksExternalResolver,
  bookmarksDataResolver,
  bookmarksPatchResolver,
  bookmarksQueryResolver
} from './bookmarks.schema'

import type { Application } from '../../declarations'
import { BookmarksService, getOptions } from './bookmarks.class'
import { bookmarksPath, bookmarksMethods } from './bookmarks.shared'

export * from './bookmarks.class'
export * from './bookmarks.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const bookmarks = (app: Application) => {
  // Register our service on the Feathers application
  app.use(bookmarksPath, new BookmarksService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: bookmarksMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(bookmarksPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(bookmarksExternalResolver),
        schemaHooks.resolveResult(bookmarksResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(bookmarksQueryValidator),
        schemaHooks.resolveQuery(bookmarksQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(bookmarksDataValidator),
        schemaHooks.resolveData(bookmarksDataResolver)
      ],
      patch: [
        schemaHooks.validateData(bookmarksPatchValidator),
        schemaHooks.resolveData(bookmarksPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [bookmarksPath]: BookmarksService
  }
}

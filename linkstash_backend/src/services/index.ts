import { user } from './users/users'
import { bookmarks } from './bookmarks/bookmarks'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(user)
  app.configure(bookmarks)
  // All services will be registered here
}

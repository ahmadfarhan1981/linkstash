import { resolve } from '@feathersjs/schema'
import {BookmarksData, bookmarksSchema} from './bookmarks.schema'
import { HookContext } from '../../declarations'
import { Bookmarks, BookmarksService } from './bookmarks.class'

export const addBookmarkResolver = resolve<Bookmarks, HookContext<BookmarksService>>({
   created:async (value,message,context) => {
        return Date.now()
   }
})
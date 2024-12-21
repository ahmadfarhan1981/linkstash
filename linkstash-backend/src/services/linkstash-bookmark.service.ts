import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';
import {Count, FilterBuilder, IsolationLevel, repository, Transaction, WhereBuilder} from '@loopback/repository';
import {Archive, Bookmark, Tag} from '../models';
import {ArchiveRepository, BookmarkRepository, LinkstashUserRepository, TagRepository} from '../repositories';
import {difference, remove, uniq} from 'lodash';
import {ArchiveService} from './archive.service';

@injectable({scope: BindingScope.TRANSIENT})
export class LinkStashBookmarkService {
  constructor(
    /* Add @inject to inject parameters */
    @repository(BookmarkRepository) public bookmarkRepository: BookmarkRepository,
    @repository(TagRepository) public tagRepository: TagRepository,
    @repository(LinkstashUserRepository) public userRepository: LinkstashUserRepository,
    @service(ArchiveService) public archiveService: ArchiveService,
    @repository(ArchiveRepository) public archiveRepository: ArchiveRepository
  ) {}

  /*
   * Add service methods here
   */
  getBookmarkMeta(id: number, archiveRepository: ArchiveRepository): Promise<Count> {
    const builder = new WhereBuilder<Archive>().eq('bookmarkId', id);
    const resultFilter = builder.build();
    return archiveRepository.count(resultFilter);
  }

  async createBookmark(userId: string, bookmark: Partial<Bookmark>): Promise<Bookmark> {
    bookmark.userId = userId;
    const transaction = await this.bookmarkRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
    const result = await this.bookmarkRepository.create(bookmark, transaction);
    await this.linkAllTags(result, userId, transaction, true);
    await transaction.commit();
    return result;
  }
  async updateBookmark(existing: Partial<Bookmark>, updated: Partial<Bookmark>): Promise<Count> {
    if (!existing) return {count: 0};
    const {userId, id} = existing;
    const oldTags = existing.tagList!;
    const newTagsToAdd = difference(updated.tagList, oldTags);
    const oldTagsToRemove = difference(oldTags, updated.tagList!);
    const transaction = await this.bookmarkRepository.beginTransaction();
    if (oldTagsToRemove.length > 0) {
      await this.unlinkTagsFromBookmark(userId!, oldTagsToRemove, id!, transaction);
    }
    if (newTagsToAdd.length > 0) {
      await this.linkTagsToBookmark(userId!, newTagsToAdd, id!, transaction, true);
    }
    const count = await this.bookmarkRepository.updateAll(updated, {id: id}, transaction);
    await transaction.commit();
    return count;
  }

  async removeBookmark(existing: Bookmark) {
    /**
     * TODO figure out safer way to do deletion.
     *
     * Currently it has to be before the transaction becuase it still query the DB to get all
     * the asset that needs to be deleted.
     *
     * Need to cache it somewhere so that we can delete it after transaction is completed
     *
     **/
    const id = existing.id!;
    const userId = existing.userId!;
    await this.archiveService.removeLocalAssetByBookmark(id);
    const transaction = await this.bookmarkRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
    await this.unlinkAllTags(existing, userId, transaction);
    await this.archiveRepository.deleteAll({bookmarkId: id}, transaction);
    await this.bookmarkRepository.deleteById(id, transaction);
    await transaction.commit();
  }
  // helper functions
  async linkAllTags(bookmark: Bookmark, userID: string, transaction: Transaction, createNonExisting: boolean = false) {
    if (!bookmark.tagList) return
    await this.linkTagsToBookmark(userID, bookmark.tagList!, bookmark.id!, transaction, createNonExisting);
  }
  async linkTagsToBookmark(userId: string, tags: string[], bookmarkId: number, transaction: Transaction, createNonExisting: boolean = false) {
    if (!tags) return
    for (const tag of tags) {
      await this.linkTagToBookmark(userId, tag, bookmarkId, transaction, createNonExisting);
    }
  }

  async linkTagToBookmark(userId: string, tag: string, bookmarkId: number, transaction: Transaction, createNonExisting: boolean = false) {
    const filter = new FilterBuilder<Tag>().impose({name: tag}).build();
    const existingTag: Tag[] = await this.userRepository.tags(userId).find(filter, transaction);
    if (existingTag.length === 0) {
      if (createNonExisting) {
        //create
        const newTag: Partial<Omit<Tag, 'id'>> = {name: tag, bookmarkIds: [bookmarkId]};
        await this.userRepository.tags(userId).create(newTag, transaction);
      } else {
        //log exists
        //exit
        return;
      }
    }

    if (existingTag.length === 1) {
      if (!existingTag[0].bookmarkIds.includes(bookmarkId)) {
        const bookmarkIds = uniq(existingTag[0].bookmarkIds.slice());
        bookmarkIds.push(bookmarkId);
        const tagData: Partial<Omit<Tag, 'id' | 'numBookmarks'>> = {bookmarkIds: bookmarkIds};
        await this.tagRepository.updateById(existingTag[0].id, tagData, transaction);
      } else {
        // log if linked
        //exit
        return;
      }
    } else {
      //log unexpected more than 1 tag
    }
  }

  async unlinkAllTags(bookmark: Bookmark, userID: string, transaction: Transaction) {
    if (!bookmark.tagList) return;
    await this.unlinkTagsFromBookmark(userID, bookmark.tagList!, bookmark.id!, transaction);
  }

  async unlinkTagsFromBookmark(userId: string, tags: string[], bookmarkId: number, transaction: Transaction) {
    if (!tags) return
    for (const tag of tags) {
      await this.unlinkTagFromBookmark(userId, tag, bookmarkId, transaction);
    }
  }

  async unlinkTagFromBookmark(userId: string, tag: string, bookmarkId: number, transaction: Transaction) {
    const filter = new FilterBuilder<Tag>().impose({name: tag}).build();
    const existingTag: Tag[] = await this.userRepository.tags(userId).find(filter, transaction);

    if (existingTag.length === 1) {
      const tagToUpdate = existingTag[0];
      if (tagToUpdate.bookmarkIds.length === 0) {
        await this.tagRepository.deleteById(tagToUpdate.id);
      } else {
        const bookmarkIds = uniq(existingTag[0].bookmarkIds.slice());
        remove(bookmarkIds, element => {
          return element === bookmarkId;
        });
        const tagData: Partial<Omit<Tag, 'id' | 'numBookmarks'>> = {bookmarkIds: bookmarkIds};
        await this.tagRepository.updateById(tagToUpdate.id, tagData, transaction);
      }
    } else {
      //log unexpected
    }
  }
}

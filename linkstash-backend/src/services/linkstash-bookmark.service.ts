import {BindingScope, injectable, service} from '@loopback/core';
import {Count, FilterBuilder, IsolationLevel, repository, Transaction, WhereBuilder} from '@loopback/repository';
import {Archive, Bookmark, Tag} from '../models';
import {ArchiveRepository, BookmarkRepository, LinkstashUserRepository, TagRepository} from '../repositories';
import {difference, remove, uniq} from 'lodash';
import {ArchiveService} from './archive.service';
import {Result, Status} from '../types';
import {SUCCESS_RESULT} from '../constants';



@injectable({scope: BindingScope.TRANSIENT})
export class LinkStashBookmarkService {
  async  getTransaction(repo : BookmarkRepository): Promise<Transaction | undefined> {
    if (repo.dataSource.connector?.name === 'sqlite3') return undefined;
    return repo.beginTransaction(IsolationLevel.READ_COMMITTED);

  }

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
    const transaction = await this.getTransaction(this.bookmarkRepository);
    const result = await this.bookmarkRepository.create(bookmark, transaction);
    await this.addBookmarkToTagsInTagList(result, userId, transaction, true);
    if(transaction) await transaction.commit();
    return result;
  }

  async updateBookmark(existing: Partial<Bookmark>, updated: Partial<Bookmark>): Promise<Result> {
    if (!existing) return {success:false,
    status: Status.ERROR,
    message: "Existing bookmark wasn't specified"};
    const {userId, id} = existing;
    const oldTags = existing.tagList!;
    const newTagsToAdd = difference(updated.tagList, oldTags);
    const oldTagsToRemove = difference(oldTags, updated.tagList!);
    const transaction =  await this.getTransaction(this.bookmarkRepository);
    try {
      if (oldTagsToRemove.length > 0) {
        await this.removeBookmarkFromTags(userId!, oldTagsToRemove, id!, transaction);
      }
      if (newTagsToAdd.length > 0) {
        await this.addBookmarkToTags(userId!, newTagsToAdd, id!, transaction, true);
      }
      await this.bookmarkRepository.updateAll(updated, {id: id}, transaction);
      if(transaction) await transaction.commit();
    } catch (error) {
      if(transaction) await  transaction.rollback();
      return {
        status: Status.ERROR,
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      }
    }
    return SUCCESS_RESULT;
  }

  async removeBookmark(existing: Bookmark) {
    /**
     * TODO figure out safer way to do deletion.
     *
     * Currently it has to be before the transaction because it still query the DB to get all
     * the asset that needs to be deleted.
     *
     * Need to cache it somewhere so that we can delete it after transaction is completed
     *
     **/
    const id = existing.id!;
    const userId = existing.userId!;
    await this.archiveService.removeLocalAssetByBookmark(id);
    const transaction = await this.getTransaction(this.bookmarkRepository);
    await this.removeBookmarkFromTagsInTagList(existing, userId, transaction);
    await this.archiveRepository.deleteAll({bookmarkId: id}, transaction);
    await this.bookmarkRepository.deleteById(id, transaction);
    if(transaction) await transaction.commit();
  }
  // helper functions

  /**
   * Add the bookmarkId to the tag's bookmarkId field for all the tags in the bookmark's taglist.
   * @param bookmark
   * @param userID
   * @param transaction
   * @param createNonExisting
   */
  async addBookmarkToTagsInTagList(bookmark: Bookmark, userID: string, transaction: Transaction | undefined, createNonExisting: boolean = false) {
    if (!bookmark.tagList) return
    await this.addBookmarkToTags(userID, bookmark.tagList!, bookmark.id!, transaction, createNonExisting);
  }

  /**
   * Give a set of tags, update the bookmarkIds of those tags to add the bookmark
   * @param userId
   * @param tags
   * @param bookmarkId
   * @param transaction
   * @param createNonExisting
   */
  async addBookmarkToTags(userId: string, tags: string[], bookmarkId: number, transaction: Transaction | undefined, createNonExisting: boolean = false) {
    if (!tags) return
    for (const tag of tags) {
      await this.addBookmarkToTag(userId, tag, bookmarkId, transaction, createNonExisting);
    }
  }

  /**
   * Add the bookmarkId to the tag's bookmarkIds field.
   * @param userId
   * @param tag
   * @param bookmarkId
   * @param transaction
   * @param createNonExisting
   */
  async addBookmarkToTag(userId: string, tag: string, bookmarkId: number, transaction: Transaction | undefined, createNonExisting: boolean = false) : Promise<Result | void> {
    const filter = new FilterBuilder<Tag>().impose({name: tag}).build();
    const existingTag: Tag[] = await this.userRepository.tags(userId).find(filter, transaction);
    if (existingTag.length === 0) {
      if (createNonExisting) {
        //create
        const newTag: Partial<Omit<Tag, 'id'>> = {name: tag, bookmarkIds: [bookmarkId]};
        await this.userRepository.tags(userId).create(newTag, transaction);
        return {
          status: Status.SUCCESS,
          success:true,
        }
      } else {//no tag and dont create
        //log exists
        //exit
        return{
          success: false,
          status: Status.ERROR,
          message: `Tag "${tag}" dont exists but create existing is false.`,
        };
      }
    }else if (existingTag.length === 1) {
      if (!existingTag[0].bookmarkIds.includes(bookmarkId)) {
        const bookmarkIds = uniq(existingTag[0].bookmarkIds.slice());
        bookmarkIds.push(bookmarkId);
        const tagData: Partial<Omit<Tag, 'id' | 'numBookmarks'>> = {bookmarkIds: bookmarkIds};
        await this.tagRepository.updateById(existingTag[0].id, tagData, transaction);
      } else {
        // log if linked
        //exit
        return {
          status: Status.SKIPPED,
          success:true,
          message: `Tag "${existingTag[0].name}" already assigned to bookmark ${bookmarkId}`
        };
      }
    } else {
      //log unexpected more than 1 tag
      return {
        success: false,
        status: Status.ERROR,
        message: 'More than 1 existing tag with same name found'
      }
    }
  }

  /**
   * Remove the bookmark's id from the Tag's bookmarkId field from all tags in the bookmark's taglist
   * @param bookmark
   * @param userID
   * @param transaction
   */
  async removeBookmarkFromTagsInTagList(bookmark: Bookmark, userID: string, transaction: Transaction | undefined) {
    if (!bookmark.tagList) return;
    await this.removeBookmarkFromTags(userID, bookmark.tagList!, bookmark.id!, transaction);
  }

  /**
   * Remove the bookmark's id from the bookmarkIds field of a set of tags.
   * @param userId
   * @param tags
   * @param bookmarkId
   * @param transaction
   */
  async removeBookmarkFromTags(userId: string, tags: string[], bookmarkId: number, transaction: Transaction | undefined) {
    if (!tags) return
    for (const tag of tags) {
      await this.removeBookmarkFromTag(userId, tag, bookmarkId, transaction);
    }
  }

  /**
   * Remove the bookmarkId from the tag's bookmarkIds field
   * @param userId
   * @param tag
   * @param bookmarkId
   * @param transaction
   */
  async removeBookmarkFromTag(userId: string, tag: string, bookmarkId: number, transaction: Transaction | undefined): Promise<Result | void> {
    const filter = new FilterBuilder<Tag>().impose({name: tag}).build();
    const existingTag: Tag[] = await this.userRepository.tags(userId).find(filter, transaction);

    if (existingTag.length === 1) {
      const tagToUpdate = existingTag[0];
      if (tagToUpdate.bookmarkIds.length === 1) {
        await this.tagRepository.deleteById(tagToUpdate.id);
        return SUCCESS_RESULT;
      } else {
        const bookmarkIds = uniq(existingTag[0].bookmarkIds.slice());
        //TODO consider checking if its not assigned
        remove(bookmarkIds, element => {
          return element === bookmarkId;
        });
        const tagData: Partial<Omit<Tag, 'id' | 'numBookmarks'>> = {bookmarkIds: bookmarkIds};
        await this.tagRepository.updateById(tagToUpdate.id, tagData, transaction);
        return SUCCESS_RESULT;
      }
    } else {
      //log unexpected
      return {
        success: false,
        status: Status.ERROR,
        message: `More than 1 existing tag named ${tag} found`
      }
    }
  }

  /**
   * Add the tag to the bookmark's taglist field, then add the bookmark's id to the tag's bookmarkIds field
   * @param userId
   * @param tag
   * @param bookmarkId
   */
  async addTagToBookmarkAndUpdateTags(userId: string, tag: string, bookmarkId: number) {
    const filter = new FilterBuilder<Bookmark>().impose({id: bookmarkId}).build();
    const bookmarks = await this.userRepository.bookmarks(userId).find(filter);
    if (bookmarks.length === 1) {
      const bookmark = bookmarks[0];
      const tagList = bookmark.tagList ?? [];

      if (tagList.includes(tag)) {
        return {
          success: true,
          status: Status.SKIPPED,
          message: 'Tag already exists in the bookmark',
        };
      }
      const newTagList = [...(bookmark.tagList ?? []), tag];
      const updatedBookmark: Partial<Bookmark> = {tagList: newTagList};
      return this.updateBookmark(bookmark, updatedBookmark);
    } else {//sum ting wong
      return {
        success: false,
        status: Status.ERROR,
        message: 'Bookmark does not exist',
      };
    }
  }

  /**
   * Remove a tag from a bookmark
   *
   * Update the bookmark's tag field and update the tag's bookmarkIds field.
   * @param userId
   * @param tag
   * @param bookmarkId
   */
  async removeTagFromBookmarkAndUpdateTags(userId: string, tag: string, bookmarkId: number) {
    const filter = new FilterBuilder<Bookmark>().impose({id: bookmarkId}).build();
    const bookmarks = await this.userRepository.bookmarks(userId).find(filter);
    if (bookmarks.length === 1) {
      const bookmark = bookmarks[0];
      const tagList = bookmark.tagList ?? [];
      if (! tagList.includes(tag)) {
        return {
          success: true,
          status: Status.SKIPPED,
          message: 'Tag is not assigned to bookmark',
        }
      }
      const newTagList = bookmark.tagList?.filter((value: string) => value !== tag) ?? [];
      const updatedBookmark: Partial<Bookmark> = {tagList: newTagList};
      return this.updateBookmark(bookmark, updatedBookmark);
    } else {//sum ting wong
      return {
        success: false,
        status: Status.ERROR,
        message: 'Bookmark does not exist',
      };
    }
  }


}


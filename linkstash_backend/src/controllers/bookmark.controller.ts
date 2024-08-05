//#region Imports
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Count, Filter, FilterBuilder, FilterExcludingWhere, IsolationLevel, Transaction, repository} from '@loopback/repository';
import {Response, RestBindings, del, get, getModelSchemaRef, operation, param, patch, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Bookmark, BookmarkRelations, BookmarkWithRelations, Tag} from '../models';
import {ArchiveRepository, BookmarkRepository, TagRepository, UserRepository} from '../repositories';
import {bookmarkPatchSchema} from '../types';
import {difference, head, remove} from 'lodash'
import {LinkStashBookmarkService} from '../services/linkstash-bookmark.service';
//#endregion

@authenticate('jwt')
export class BookmarkController {
  constructor(
    @repository(BookmarkRepository) public bookmarkRepository: BookmarkRepository,
    @repository(TagRepository) public tagRepository: TagRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @service(LinkStashBookmarkService) public bookmarkService: LinkStashBookmarkService
  ) {}


  //readonly actions
  /**
   * Read only actions
   * - find
   * - findById
   * - findAll
   *
   */


  // @intercept('interceptors.AddCountToResultInterceptor')
  @get('/bookmarks')
  @response(200, {
    description: 'Array of Bookmark model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bookmark, {includeRelations: true}),
        },
      },
    },
  })
  async find(@inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
  @param.filter(Bookmark) filter?: Filter<Bookmark>
              ): Promise<Object> {
    const builder = new FilterBuilder(filter).impose({userId: currentUserProfile[securityId]});
    const resultFilter = builder.build();
    const allResultFilter: Filter<Bookmark> = JSON.parse(JSON.stringify(resultFilter));
    if (allResultFilter.limit) delete allResultFilter.limit;
    if (allResultFilter.offset) delete allResultFilter.offset;
    if (allResultFilter.skip) delete allResultFilter.skip;

    const all = await this.bookmarkRepository.find(allResultFilter);
    const data = await this.bookmarkRepository.find(resultFilter)
    //TODO getting archive count might be expensive
    const addArchiveCountToBookmark = async (bookmark:Bookmark )=>{ bookmark.archiveCount = await this.bookmarkService.getBookmarkMeta(bookmark.id!, archiveRepository ) }
    await Promise.all(data.map(addArchiveCountToBookmark))
    const returnValue = {
      countAll: all.length,
      data: data,
    };
    return returnValue;
  }

  @get('/bookmarks/{id}')
  @response(200, {
    description: 'Bookmark model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bookmark, {includeRelations: true}) ,
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @repository(UserRepository) userRepository: UserRepository,
    @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.filter(Bookmark, {exclude: 'where'}) filter?: FilterExcludingWhere<Bookmark>,
  ): Promise<BookmarkWithRelations> {
    const combinedUserFilter = new FilterBuilder<Bookmark>(filter).impose({userId: currentUserProfile[securityId], id: id}).build();
    const results = await userRepository.bookmarks(currentUserProfile['securityId']).find(combinedUserFilter);
    if (results.length > 0){
      const bookmark = results[0];
      bookmark.archiveCount = await this.bookmarkService.getBookmarkMeta(bookmark.id!, archiveRepository )
      return bookmark;
    }

    res.status(404);
    throw new Error(`Entity not found: Bookmark with id ${id}`);
  }

  // @intercept('interceptors.AddCountToResultInterceptor')
  // TODO only admins should be able to do this
  @get('/all_bookmarks')
  @response(200, {
    description: 'Array of Bookmark model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bookmark, {includeRelations: true}),
        },
      },
    },
  })
  async findAll(@inject(SecurityBindings.USER) currentUserProfile: UserProfile, @param.filter(Bookmark) filter?: Filter<Bookmark>): Promise<Object> {
    const all = await this.bookmarkRepository.find(filter);

    const returnValue = {
      ...filter,
      countAll: all.length,
      data: all,
    };
    return returnValue;
  }




  //write actions
  /**
   * readwrite actions
   * - create
   * - updateByID
   * - deleteByID
   *
   */


  @post('/bookmarks')
  @response(200, {
    description: 'Bookmark model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bookmark)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookmark, {
            title: 'NewBookmark',
            exclude: ['id'],
          }),
        },
      },
    })
    bookmark: Omit<Bookmark, 'id'>,
  ): Promise<Bookmark> {
    //TODO currently non atomic, use transaction
    bookmark.userId = currentUserProfile[securityId];
    const transaction = await this.bookmarkRepository.beginTransaction(IsolationLevel.READ_COMMITTED)
    const result = await this.bookmarkRepository.create(bookmark, transaction);
    await this.linkAllTags(result, currentUserProfile[securityId], transaction, true)
    await transaction.commit()
    return result;
    //return this.userRepository.bookmarks(id).create(bookmark);
  }

  @patch('/bookmarks/{id}')
  @response(204, {
    description: 'Bookmark PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: bookmarkPatchSchema,
        },
      },
    })
    bookmark: Bookmark,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    // console.log(bookmark);
    const existing = await this.userRepository.bookmarks(currentUserProfile['securityId']).find({where: {id: id}});
    // console.log(existing);
    if (existing.length > 0) {
      const oldTags = existing[0].tagList!
      const newTagsToAdd = difference(bookmark.tagList, oldTags )
      const oldTagsToRemove = difference(oldTags, bookmark.tagList!)
      const transaction = await this.bookmarkRepository.beginTransaction();
      if(oldTagsToRemove.length> 0 ){
        await this.unlinkTagsFromBookmark(currentUserProfile[securityId],
                                          oldTagsToRemove,
                                          id,
                                          transaction)
      }
      if(newTagsToAdd.length > 0 ){
        await this.linkTagsToBookmark(currentUserProfile[securityId],
                                      newTagsToAdd,
                                      id,
                                      transaction,
                                      true)
      }
      await this.bookmarkRepository.updateAll(bookmark, {id: id}, transaction);
      await transaction.commit()
    } else {
      res.status(404);
      throw new Error(`Entity not found: Bookmark with id ${id}`);
    }
  }

  @del('/bookmarks/{id}')
  @response(204, {
    description: 'Bookmark DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const existing = await this.userRepository.bookmarks(currentUserProfile[securityId]).find({where: {id: id}});
    if (existing.length > 0) {
      //TODO transaction
      const transaction = await this.bookmarkRepository.beginTransaction(IsolationLevel.READ_COMMITTED)
      await this.unlinkAllTags(existing[0],currentUserProfile[securityId], transaction)
      await this.bookmarkRepository.deleteById(id);
      await transaction.commit()
    } else {
      res.status(404);
      throw new Error(`Entity not found: Bookmark with id ${id}`);
    }

    //await this.bookmarkRepository.deleteById(id);
  }

  // helper functions
  async linkAllTags(bookmark:Bookmark, userID:string, transaction:Transaction, createNonExisting:boolean = false){
    await this.linkTagsToBookmark(userID, bookmark.tagList!, bookmark.id!, transaction, createNonExisting)
  }
  async linkTagsToBookmark(userId:string, tags:string[], bookmarkId:number, transaction:Transaction, createNonExisting:boolean = false){
    for(const tag of tags){
      await this.linkTagToBookmark(userId, tag, bookmarkId, transaction, createNonExisting)
    }
  }

  async linkTagToBookmark(userId:string, tag:string, bookmarkId:number, transaction:Transaction, createNonExisting:boolean = false){
    const filter = new FilterBuilder<Tag>().impose({name: tag}).build();
    const existingTag:Tag[] = await this.userRepository.tags(userId).find(filter, transaction);
      if(existingTag.length === 0){
        if(createNonExisting){
          //create
          const newTag: Partial<Omit<Tag, 'id'>> = {name: tag, bookmarkIds: [bookmarkId]};
        await this.userRepository.tags(userId).create(newTag, transaction);
        }else{
          //log exists
          //exit
          return
        }
      }

      if (existingTag.length === 1) {
        if(!(existingTag[0].bookmarkIds.includes(bookmarkId))){
          existingTag[0].bookmarkIds.push(bookmarkId);
          await this.tagRepository.updateById(existingTag[0].id, existingTag[0], transaction);
        }else{
          // log if linked
          //exit
          return
        }
      }else{
      //log unexpected more than 1 tag
      }
  }


  async unlinkAllTags(bookmark:Bookmark, userID:string, transaction:Transaction){
    if(!bookmark.tagList) return
    await this.unlinkTagsFromBookmark(userID, bookmark.tagList!, bookmark.id!, transaction)
  }

  async unlinkTagsFromBookmark(userId:string, tags:string[], bookmarkId:number, transaction:Transaction){
    for(const tag of tags){
      await this.unlinkTagFromBookmark(userId, tag, bookmarkId, transaction)
    }
  }

  async unlinkTagFromBookmark(userId:string, tag:string, bookmarkId:number, transaction:Transaction){
    const filter = new FilterBuilder<Tag>().impose({name: tag}).build();
    const existingTag:Tag[] = await this.userRepository.tags(userId).find(filter, transaction);

    if (existingTag.length === 1) {
      const tagToUpdate = existingTag[0]
      remove(tagToUpdate.bookmarkIds, (element)=>{return element === bookmarkId})
      if(tagToUpdate.bookmarkIds.length===0){
        await this.tagRepository.deleteById(tagToUpdate.id)
      }else{
        await this.tagRepository.updateById(tagToUpdate.id, tagToUpdate, transaction);
      }
    }else{
      //log unexpected
    }
  }

}

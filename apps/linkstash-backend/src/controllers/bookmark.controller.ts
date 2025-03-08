//#region Imports
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Filter, FilterBuilder, FilterExcludingWhere, repository} from '@loopback/repository';
import {Response, RestBindings, del, get, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Bookmark, BookmarkWithRelations} from '../models';
import {ArchiveRepository, BookmarkRepository, LinkstashUserRepository, TagRepository} from '../repositories';
import {LinkStashBookmarkService} from '../services/linkstash-bookmark.service';
import {bookmarkPatchSchema} from '../types';
import {ArchiveService} from '../services';
//#endregion

@authenticate('jwt')
export class BookmarkController {
  constructor(
    @repository(BookmarkRepository) public bookmarkRepository: BookmarkRepository,
    @repository(TagRepository) public tagRepository: TagRepository,
    @repository(LinkstashUserRepository) public userRepository: LinkstashUserRepository,
    @service(LinkStashBookmarkService) public bookmarkService: LinkStashBookmarkService,
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
          type: 'object',
          properties: {
            countAll: {
              type: 'number',
              description: 'Total count of all Bookmark instances',
            },
            data: {
              type: 'array',
              items: getModelSchemaRef(Bookmark, {includeRelations: false}),
              description: 'Array of filtered Bookmark instances',
            },
          },
          required: ['countAll', 'data'],
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
    @param.filter(Bookmark) filter?: Filter<Bookmark>,
  ): Promise<Object> {
    const builder = new FilterBuilder(filter).impose({userId: currentUserProfile[securityId]});
    const resultFilter = builder.build();
    const allResultFilter: Filter<Bookmark> = JSON.parse(JSON.stringify(resultFilter));
    if (allResultFilter.limit) delete allResultFilter.limit;
    if (allResultFilter.offset) delete allResultFilter.offset;
    if (allResultFilter.skip) delete allResultFilter.skip;

    const all = await this.bookmarkRepository.find(allResultFilter);
    const data = await this.bookmarkRepository.find(resultFilter);
    //TODO getting archive count might be expensive
    const addArchiveCountToBookmark = async (bookmark: Bookmark) => {
      bookmark.archiveCount = await this.bookmarkService.getBookmarkMeta(bookmark.id!, archiveRepository);
    };
    await Promise.all(data.map(addArchiveCountToBookmark));
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
        schema: getModelSchemaRef(Bookmark, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @repository(LinkstashUserRepository) userRepository: LinkstashUserRepository,
    @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.filter(Bookmark, {exclude: 'where'}) filter?: FilterExcludingWhere<Bookmark>,
  ): Promise<BookmarkWithRelations> {
    const combinedUserFilter = new FilterBuilder<Bookmark>(filter).impose({userId: currentUserProfile[securityId], id: id}).build();
    const results = await userRepository.bookmarks(currentUserProfile['securityId']).find(combinedUserFilter);
    if (results.length > 0) {
      const bookmark = results[0];
      bookmark.archiveCount = await this.bookmarkService.getBookmarkMeta(bookmark.id!, archiveRepository);
      return bookmark;
    }

    res.status(404);
    throw new Error(`Entity not found: Bookmark with id ${id}`);
  }

  // @intercept('interceptors.AddCountToResultInterceptor')
  // TODO only admins should be able to do this
  // @get('/all_bookmarks')
  // @response(200, {
  //   description: 'Array of Bookmark model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Bookmark, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async findAll(@inject(SecurityBindings.USER) currentUserProfile: UserProfile, @param.filter(Bookmark) filter?: Filter<Bookmark>): Promise<Object> {
  //   const all = await this.bookmarkRepository.find(filter);

  //   const returnValue = {
  //     ...filter,
  //     countAll: all.length,
  //     data: all,
  //   };
  //   return returnValue;
  // }

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
    return this.bookmarkService.createBookmark(currentUserProfile[securityId], bookmark)
  }

  @patch('/bookmarks/{id}')
  @response(204, {
    description: 'Bookmark PATCH success',
  })
  @response(404, {
    description: 'Bookmark not found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Cannot find the bookmark specified',
            },
          },
        },
      },
    },
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
    const existing = await this.userRepository.bookmarks(currentUserProfile['securityId']).find({where: {id: id}});
    if (existing.length > 0) {
      await this.bookmarkService.updateBookmark(existing[0], bookmark)
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
    @service(ArchiveService) archiveService : ArchiveService,
    @repository(ArchiveRepository) archiveRepository : ArchiveRepository,
  ): Promise<void> {
    const existing = await this.userRepository.bookmarks(currentUserProfile[securityId]).find({where: {id: id}});
    if (existing.length > 0) {
      await this.bookmarkService.removeBookmark(existing[0])
    } else {
      res.status(404);
      throw new Error(`Entity not found: Bookmark with id ${id}`);
    }
  }
}

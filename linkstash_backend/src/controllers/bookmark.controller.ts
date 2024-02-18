//#region Imports
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  Response,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Archive, Bookmark, User} from '../models';
import {BookmarkRepository} from '../repositories';
import {ArchiveService} from '../services';
//#endregion

@authenticate('jwt')
export class BookmarkController {
  constructor(
    @repository(BookmarkRepository)
    public bookmarkRepository: BookmarkRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}


//#region CRUD related endpoints
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
    bookmark.userId = currentUserProfile[securityId];
    return this.bookmarkRepository.create(bookmark);
  }

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
  async find(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.filter(Bookmark) filter?: Filter<Bookmark>,
  ): Promise<Object> {
    // this.response.status(201);
    console.log(JSON.stringify(currentUserProfile));
    var builder = new FilterBuilder(filter);

    builder.impose({userId: currentUserProfile[securityId]});
    const resultFilter = builder.build();
    var allResultFilter: Filter<Bookmark> = JSON.parse(
      JSON.stringify(resultFilter),
    );
    if (allResultFilter.limit) delete allResultFilter.limit;

    console.log(JSON.stringify(allResultFilter));
    const all = await this.bookmarkRepository.find(allResultFilter);

    const returnValue = {
      ...filter,
      countAll: all.length,
      data: all,
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
    @param.filter(Bookmark, {exclude: 'where'})
    filter?: FilterExcludingWhere<Bookmark>,
  ): Promise<Bookmark> {
    return this.bookmarkRepository.findById(id, filter);
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
  async findAll(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.filter(Bookmark) filter?: Filter<Bookmark>,
  ): Promise<Object> {
    const all = await this.bookmarkRepository.find(filter);

    const returnValue = {
      ...filter,
      countAll: all.length,
      data: all,
    };
    return returnValue;
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
          schema: getModelSchemaRef(Bookmark, {partial: true}),
        },
      },
    })
    bookmark: Bookmark,
  ): Promise<void> {
    await this.bookmarkRepository.updateById(id, bookmark);
  }

  @del('/bookmarks/{id}')
  @response(204, {
    description: 'Bookmark DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bookmarkRepository.deleteById(id);
  }

  @get('/bookmarks/count')
  @response(200, {
    description: 'Bookmark model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Bookmark) where?: Where<Bookmark>): Promise<Count> {
    return this.bookmarkRepository.count(where);
  }
//#endregion

//#region Archive related endpoints
  @post('/bookmarks/{id}/archive')
  @response(200, {
    description: 'Bookmark archived',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bookmark, {includeRelations: true}),
      },
    },
  })
  async archive(
    @service(ArchiveService) archiveService: ArchiveService,
    @param.path.number('id') id: number,
    @requestBody() archive: Required<Archive>,
    @param.filter(Bookmark, {exclude: 'where'})
    filter?: FilterExcludingWhere<Bookmark>,
  ): Promise<Archive | undefined> {
    const bookmark = await this.bookmarkRepository.findById(id, filter);
    if (bookmark) {
      return await archiveService.archive(bookmark);
    }
  }

  @get('/bookmarks/{id}/archives', {
    responses: {
      '200': {
        description: 'Get all available archives of the bookmark',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Archive)},
          },
        },
      },
    },
  })
  async findArchives(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Archive>,
  ): Promise<Archive[]> {
    return this.bookmarkRepository.archives(id).find(filter);
  }

  @get('/bookmarks/{id}/archive', {
    responses: {
      '200': {
        description: 'Get the latest archive for a bookmark',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Archive)},
          },
        },
      },
    },
  })
  async getLatestArchive(
    @param.path.number('id') id: number,
  ): Promise<Archive> {
    const builder = new FilterBuilder<Archive>()
    const filter =builder.order(['version DESC'])
                  .limit(1)
                  .build()
    const archives = await this.findArchives(id, filter);
    return archives[0];
  }

  @del('/bookmarks/{id}/archives', {
    responses: {
      '200': {
        description: 'Bookmark.Archive DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deleteArchive(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Archive))
    where?: Where<Archive>,
  ): Promise<Count> {
    return this.bookmarkRepository.archives(id).delete(where);
  }
//#endregion

//#region Users related endpoints
  @get('/bookmarks/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Bookmark',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Bookmark.prototype.id,
  ): Promise<User> {
    return this.bookmarkRepository.user(id);
  }
//#endregion


  /**
   * ! Everything below this line are default LB4 implementation. Everything above is customized for LinkStash
   * TODO verify that it fits our needs
   */

  // @patch('/bookmarks')
  // @response(200, {
  //   description: 'Bookmark PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Bookmark, {partial: true}),
  //       },
  //     },
  //   })
  //   bookmark: Bookmark,
  //   @param.where(Bookmark) where?: Where<Bookmark>,
  // ): Promise<Count> {
  //   return this.bookmarkRepository.updateAll(bookmark, where);
  // }


}

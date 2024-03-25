//#region Imports
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterBuilder, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Bookmark, BookmarkWithRelations} from '../models';
import {BookmarkRepository} from '../repositories';
//#endregion

@authenticate('jwt')
export class BookmarkController {
  constructor(
    @repository(BookmarkRepository)
    public bookmarkRepository: BookmarkRepository,
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
  async find(@inject(SecurityBindings.USER) currentUserProfile: UserProfile, @param.filter(Bookmark) filter?: Filter<Bookmark>): Promise<Object> {
    const builder = new FilterBuilder(filter);
    builder.impose({userId: currentUserProfile[securityId]});
    const resultFilter = builder.build();
    const allResultFilter: Filter<Bookmark> = JSON.parse(JSON.stringify(resultFilter));
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
  ): Promise<BookmarkWithRelations> {
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
  async findAll(@inject(SecurityBindings.USER) currentUserProfile: UserProfile, @param.filter(Bookmark) filter?: Filter<Bookmark>): Promise<Object> {
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

  //#region Users related endpoints
  // @get('/bookmarks/{id}/user', {
  //   responses: {
  //     '200': {
  //       description: 'User belonging to Bookmark',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(User),
  //         },
  //       },
  //     },
  //   },
  // })
  // async getUser(
  //   @param.path.number('id') id: typeof Bookmark.prototype.id,
  // ): Promise<User> {
  //   return this.bookmarkRepository.user(id);
  // }
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

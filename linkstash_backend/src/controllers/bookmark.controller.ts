//#region Imports
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, FilterBuilder, FilterExcludingWhere, repository} from '@loopback/repository';
import {Response, RestBindings, del, get, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Bookmark, BookmarkWithRelations} from '../models';
import {BookmarkRepository, UserRepository} from '../repositories';
import {bookmarkPatchSchema} from '../types';
//#endregion

@authenticate('jwt')
export class BookmarkController {
  constructor(
    @repository(BookmarkRepository) public bookmarkRepository: BookmarkRepository,
    @repository(UserRepository) public userRepository: UserRepository,
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
    //return this.userRepository.bookmarks(id).create(bookmark);
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
    const builder = new FilterBuilder(filter).impose({userId: currentUserProfile[securityId]});
    const resultFilter = builder.build();
    const allResultFilter: Filter<Bookmark> = JSON.parse(JSON.stringify(resultFilter));
    if (allResultFilter.limit) delete allResultFilter.limit;

    const all = await this.bookmarkRepository.find(allResultFilter);
    const returnValue = {
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
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @repository(UserRepository) userRepository: UserRepository,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.filter(Bookmark, {exclude: 'where'}) filter?: FilterExcludingWhere<Bookmark>,
  ): Promise<BookmarkWithRelations> {
    const combinedUserFilter = new FilterBuilder<Bookmark>(filter).impose({userId: currentUserProfile[securityId], id: id}).build();
    const results = await userRepository.bookmarks(currentUserProfile['securityId']).find(combinedUserFilter);
    if (results.length > 0) return results[0];

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
    const existing = await this.userRepository.bookmarks(currentUserProfile[securityId]).find({where: {id: id}});
    // console.log(existing);
    if (existing.length > 0) {
      await this.bookmarkRepository.updateAll(bookmark, {id: id});
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
      await this.bookmarkRepository.deleteById(id);
    } else {
      res.status(404);
      throw new Error(`Entity not found: Bookmark with id ${id}`);
    }

    //await this.bookmarkRepository.deleteById(id);
  }

  // @get('/bookmarks/count')
  // @response(200, {
  //   description: 'Bookmark model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(@param.where(Bookmark) where?: Where<Bookmark>): Promise<Count> {
  //   return this.bookmarkRepository.count(where);
  // }
  //#endregion
}

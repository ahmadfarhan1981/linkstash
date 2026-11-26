//#region Imports
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Count, CountSchema, Filter, FilterBuilder, Where, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors, del, get, getModelSchemaRef, param, post, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Archive, Bookmark} from '../models';
import {ArchiveRepository, BookmarkRepository} from '../repositories';
import {ArchiveService} from '../services';
//#endregion

@authenticate('jwt')
export class ArchiveController {
  constructor(
    @repository(BookmarkRepository)
    public bookmarkRepository: BookmarkRepository,
  ) {}

  private async ownedBookmark(id: number, userId: string): Promise<Bookmark> {
    const found = await this.bookmarkRepository.find({where: {id, userId}, limit: 1});
    if (found.length === 0) {
      throw new HttpErrors.NotFound(`Entity not found: Bookmark with id ${id}`);
    }
    return found[0];
  }

  //#region Archive related endpoints
  //@intercept('interceptors.AddCountToResultInterceptor')
  @post('/bookmarks/{id}/archive')
  @response(200, {
    description: 'Bookmark archived',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Archive),
      },
    },
  })
  async archive(
    @service(ArchiveService) archiveService: ArchiveService,
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Archive | undefined> {
    const bookmark = await this.ownedBookmark(id, currentUserProfile[securityId]);
    const result = await archiveService.archive(bookmark);
    return result.archive;
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
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.object('filter') filter?: Filter<Archive>,
  ): Promise<Archive[]> {
    await this.ownedBookmark(id, currentUserProfile[securityId]);
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
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Archive> {
    const builder = new FilterBuilder<Archive>();
    const filter = builder.order(['version DESC']).limit(1).build();
    const archives = await this.findArchives(id, currentUserProfile, filter);
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
  async deleteArchives(
    @param.path.number('id') id: number,
    @service(ArchiveService) archiveService: ArchiveService,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Count> {
    const removeArchiveAssets = (archive: Archive) => {
      archiveService.removeLocalAssets(archive.bookmarkId, archive.Version);
    };
    await this.ownedBookmark(id, currentUserProfile[securityId]);
    const archives = await this.bookmarkRepository.archives(id).find();
    archives.map(removeArchiveAssets);
    return this.bookmarkRepository.archives(id).delete();
  }

  @get('/bookmarks/{id}/archives/meta', {
    responses: {
      '200': {
        description: 'Get number of archives of a bookmark',
        content: {
          'application/json': {
            schema: CountSchema,
          },
        },
      },
    },
  })
  async findArchivesCount(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
    @param.query.object('filter') filter?: Where<Archive>,
  ): Promise<Count> {
    await this.ownedBookmark(id, currentUserProfile[securityId]);
    const builder = new WhereBuilder(filter).impose({bookmarkId: id});
    const resultFilter = builder.build();
    return archiveRepository.count(resultFilter);
  }

  //#endregion
}

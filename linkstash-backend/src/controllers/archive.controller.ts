//#region Imports
import {authenticate} from '@loopback/authentication';
import {intercept, service} from '@loopback/core';
import {Count, CountSchema, Filter, FilterBuilder, Where, WhereBuilder, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post, response} from '@loopback/rest';
import {Archive} from '../models';
import {ArchiveRepository, BookmarkRepository} from '../repositories';
import {ArchiveService} from '../services';
//#endregion

@authenticate('jwt')
export class ArchiveController {
  constructor(
    @repository(BookmarkRepository)
    public bookmarkRepository: BookmarkRepository,
  ) {}

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
  async archive(@service(ArchiveService) archiveService: ArchiveService, @param.path.number('id') id: number): Promise<Archive | undefined> {
    const bookmark = await this.bookmarkRepository.findById(id);
    if (bookmark) {
      const result = await archiveService.archive(bookmark);
      return result;
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
  async findArchives(@param.path.number('id') id: number, @param.query.object('filter') filter?: Filter<Archive>): Promise<Archive[]> {
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
  async getLatestArchive(@param.path.number('id') id: number): Promise<Archive> {
    const builder = new FilterBuilder<Archive>();
    const filter = builder.order(['version DESC']).limit(1).build();
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
  async deleteArchives(@param.path.number('id') id: number, @service(ArchiveService) archiveService: ArchiveService): Promise<Count | undefined> {
    const removeArchiveAssets = (archive: Archive) => {
      archiveService.removeLocalAssets(archive.bookmarkId, archive.Version);
    };
    const bookmark = await this.bookmarkRepository.findById(id);
    if (bookmark) {
      const archives = await this.bookmarkRepository.archives(id).find();
      archives.map(removeArchiveAssets);
      return this.bookmarkRepository.archives(id).delete();
    }
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
    @repository(ArchiveRepository) archiveRepository: ArchiveRepository,
    @param.query.object('filter') filter?: Where<Archive>,
  ): Promise<Count> {
    const builder = new WhereBuilder(filter).impose({bookmarkId: id});
    const resultFilter = builder.build();
    return archiveRepository.count(resultFilter);
  }

  //#endregion
}

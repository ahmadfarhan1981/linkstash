//#region Imports
import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterBuilder,
  Where,
  WhereBuilder,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  response,
} from '@loopback/rest';
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
  ): Promise<Archive | undefined> {
    const bookmark = await this.bookmarkRepository.findById(id);
    if (bookmark) {
      return archiveService.archive(bookmark);
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
  async deleteArchives(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Archive))
    where?: Where<Archive>,
  ): Promise<Count> {
    return this.bookmarkRepository.archives(id).delete(where);
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
    return archiveRepository.count(resultFilter)
  }



  @del('/archives/{id}', {
    responses: {
      '204': {
        description: 'Archive DELETE success',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deleteArchive(
    @param.path.string('id') id: typeof Archive.prototype.ArchiveId,
    @repository(ArchiveRepository) archiveRepository :ArchiveRepository,
  ): Promise<void> {
    return archiveRepository.deleteById(id);
  }



  //#endregion
}

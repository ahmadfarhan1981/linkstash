import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Archive,
  Bookmark,
} from '../models';
import {ArchiveRepository} from '../repositories';

export class ArchiveBookmarkController {
  constructor(
    @repository(ArchiveRepository)
    public archiveRepository: ArchiveRepository,
  ) { }

  @get('/archives/{id}/bookmark', {
    responses: {
      '200': {
        description: 'Bookmark belonging to Archive',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bookmark),
          },
        },
      },
    },
  })
  async getBookmark(
    @param.path.string('id') id: typeof Archive.prototype.ArchiveId,
  ): Promise<Bookmark> {
    return this.archiveRepository.bookmark(id);
  }


  @get('/archives/{id}/bookmark', {
    responses: {
      '200': {
        description: 'Bookmark belonging to Archive',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bookmark),
          },
        },
      },
    },
  })
  async deleteArchive(
    @param.path.string('id') id: typeof Archive.prototype.ArchiveId,
  ): Promise<void> {
    await  this.archiveRepository.deleteById(id)
  }

}

import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Count, WhereBuilder} from '@loopback/repository';
import {Archive, ArchiveRelations} from '../models';
import {ArchiveRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class LinkStashBookmarkService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  getBookmarkMeta(id:number, archiveRepository: ArchiveRepository):Promise<Count> {
    const builder = new WhereBuilder<Archive>().eq("bookmarkId",id);
    const resultFilter = builder.build();
    return archiveRepository.count(resultFilter)
  }
}

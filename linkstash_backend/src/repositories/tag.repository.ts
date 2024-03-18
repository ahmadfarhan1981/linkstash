import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {BookmarkDataSource} from '../datasources';
import {Tag, TagRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype.Id,
  TagRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Tag.prototype.Id>;

  constructor(
    @inject('datasources.bookmark') dataSource: BookmarkDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Tag, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

import {inject} from '@loopback/core';
import {DefaultTransactionalRepository, juggler} from '@loopback/repository';
import {RefreshToken, RefreshTokenRelations} from '../models';
import {RefreshTokenServiceBindings} from '../keys';

export class RefreshTokenRepository extends DefaultTransactionalRepository<
  RefreshToken,
  typeof RefreshToken.prototype.id,
  RefreshTokenRelations
> {
  constructor(
    @inject(`datasources.${RefreshTokenServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
  ) {
    super(RefreshToken, dataSource);
  }
}

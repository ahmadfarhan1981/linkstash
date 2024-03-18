import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {BookmarkRepository} from './repositories/bookmark.repository';
import {MySequence} from './sequence';

import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {BookmarkDataSource} from './datasources';

export {ApplicationConfig};
export class LinkstashApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  private async customMigration(): Promise<void> {
    /**
     * TODO: cant seem to get add index to the relation fields via model file
     *       even after adding the jsonschema to the belongTo decorator
     * TODO: these are mysql specific
     */
    const bookmarkRepo = await this.getRepository(BookmarkRepository);
    const indices = await bookmarkRepo.execute('SHOW INDEX FROM `BookmarkTag`');
    if (
      // eslint-disable-next-line @typescript-eslint/naming-convention
      !indices.some((row: {Column_name: string}) => {
        return row.Column_name === 'bookmarkId';
      })
    )
      await bookmarkRepo.execute(
        'ALTER TABLE `BookmarkTag` ADD INDEX(`bookmarkId`)',
      );

    if (
      // eslint-disable-next-line @typescript-eslint/naming-convention
      !indices.some((row: {Column_name: string}) => {
        return row.Column_name === 'tagId';
      })
    )
      await bookmarkRepo.execute(
        'ALTER TABLE `BookmarkTag` ADD INDEX(`tagId`) ',
      );

    // 2. Make further changes. When creating predefined model instances,
    // handle the case when these instances already exist.
    // const found = await bookmarkRepo.findOne({where: {title: 'google'}});
    // if (!found) {
    //   await bookmarkRepo.create({
    //     title: 'google',
    //     url: 'http://google.com',
    //     description: 'it is google',
    //     created: Date.now(),
    //   });
    // }
    console.log('MIGRATE');
  }
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    //Authentication
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(BookmarkDataSource, UserServiceBindings.DATASOURCE_NAME);
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options); // 1. Run migration scripts provided by connectors
    await this.customMigration(); // 2. Custom migration
  }
}

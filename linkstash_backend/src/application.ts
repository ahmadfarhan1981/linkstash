import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, UserServiceBindings} from '@loopback/authentication-jwt';
import {HealthComponent} from '@loopback/health';
import {BookmarkDataSource} from './datasources';
import {TagRepository} from './repositories';

export {ApplicationConfig};
export class LinkstashApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  private async customMigration(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('MIGRATE');
    const tagRepo = await this.getRepository(TagRepository);
    const sql:string = "ALTER TABLE Tag CHANGE `numBookmarks` `numBookmarks` INT GENERATED ALWAYS AS (LENGTH(bookmarkIds)-LENGTH(REPLACE(bookmarkIds, ',', ''))+1 ) STORED; "    
    const result = await tagRepo.execute(sql)
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

    this.component(HealthComponent);


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

    //Mount authorization
    // this.component(AuthorizationComponent)

    // Bind datasource
    this.dataSource(BookmarkDataSource, UserServiceBindings.DATASOURCE_NAME);
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options); // 1. Run migration scripts provided by connectors
    await this.customMigration(); // 2. Custom migration
  }
}

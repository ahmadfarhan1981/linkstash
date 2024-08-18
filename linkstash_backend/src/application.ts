import {JWTAuthenticationComponent, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {genSalt, hash} from 'bcryptjs';

import {ApplicationConfig} from '@loopback/core';
import {AuthenticationComponent} from '@loopback/authentication';
import {BookmarkDataSource} from './datasources';
import {BootMixin} from '@loopback/boot';
import {HealthComponent} from '@loopback/health';
import {MySequence} from './sequence';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {TagRepository} from './repositories';
import path from 'path';

export {ApplicationConfig};
export class LinkstashApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  private async customMigration(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Running additional migration tasks..');
    const tagRepo = await this.getRepository(TagRepository);
    const sql:string = "ALTER TABLE Tag CHANGE `numBookmarks` `numBookmarks` INT GENERATED ALWAYS AS (LENGTH(bookmarkIds)-LENGTH(REPLACE(bookmarkIds, ',', ''))+1 ) STORED; "
    const result = await tagRepo.execute(sql)

    const userRepo = await this.getRepository(UserRepository)

    const numUsers = (await userRepo.count()).count;
    if(numUsers===0){
      console.log("Empty users table. Creating default user...")
      //await userRepo.create({email:"admin@linkstashapp.com", password:"password"})
      const password = await hash("password", await genSalt());
      const savedUser = await userRepo.create({email:"admin@linkstashapp.com"});
      await userRepo.userCredentials(savedUser.id).create({password});
      console.log("User 'admin@linkstashapp.com' created.")
    }

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

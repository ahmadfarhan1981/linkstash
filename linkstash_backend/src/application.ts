import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {genSalt, hash} from 'bcryptjs';

import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, TokenServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {HealthComponent} from '@loopback/health';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {UserServiceBindings} from './bindings/UserService.binding';
import {BookmarkDataSource} from './datasources';
import {LinkstashUserRepository, TagRepository, UserCredentialsRepository} from './repositories';
import {MySequence} from './sequence';
import {LinkStashUserService} from './services';

export {ApplicationConfig};
export class LinkstashApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  private async customMigration(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Running additional migration tasks..');
    const tagRepo = await this.getRepository(TagRepository);
    const sql: string = "ALTER TABLE Tag CHANGE `numBookmarks` `numBookmarks` INT GENERATED ALWAYS AS (LENGTH(bookmarkIds)-LENGTH(REPLACE(bookmarkIds, ',', ''))+1 ) STORED; ";
    const result = await tagRepo.execute(sql);

    const userRepo = await this.getRepository(LinkstashUserRepository);

    const numUsers = (await userRepo.count()).count;
    if (numUsers === 0) {
      console.log('Empty users table. Creating default user...');
      //await userRepo.create({email:"admin@linkstashapp.com", password:"password"})
      const password = await hash('password', await genSalt());
      const savedUser = await userRepo.create({username: 'admin'});
      await userRepo.userCredentials(savedUser.id).create({password});
      await userRepo.userSettings(savedUser.id).create({isUserAdmin: true});
      console.log("User 'admin' created.");
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

    //jwt related
    this.bind(TokenServiceBindings.TOKEN_SECRET).to('DP65JcIAXiD6vv0CmdtkOw8QA0OwJaiA');
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(LinkstashUserRepository);
    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(UserCredentialsRepository);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(LinkStashUserService);
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options); // 1. Run migration scripts provided by connectors
    await this.customMigration(); // 2. Custom migration
  }
}

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
    console.log('Running additional migration tasks..');

    const tagRepo = await this.getRepository(TagRepository);
    const dbType  = process.env.DB_TYPE ?? "mysql"
    if (dbType === 'mysql') {
        // MySQL Query
        const sql = `
            ALTER TABLE Tag CHANGE numBookmarks numBookmarks
            INT GENERATED ALWAYS AS
            (LENGTH(bookmarkIds) - LENGTH(REPLACE(bookmarkIds, ',', '')) + 1 ) STORED;
        `;
        await tagRepo.execute(sql);
    } else if (dbType === 'sqlite') {
        // SQLite-compatible solution using a trigger
        const sql1 = `ALTER TABLE Tag ADD COLUMN numBookmarks INT DEFAULT 0;`;

        // Separate triggers for INSERT and UPDATE
        const sql2 = `
            CREATE TRIGGER IF NOT EXISTS tag_after_insert
            AFTER INSERT ON Tag
            FOR EACH ROW
            BEGIN
                UPDATE Tag
                SET numBookmarks = (LENGTH(NEW.bookmarkIds) - LENGTH(REPLACE(NEW.bookmarkIds, ',', '')) + 1)
                WHERE id = NEW.id;
            END;
        `;

        const sql3 = `
            CREATE TRIGGER IF NOT EXISTS tag_after_update
            AFTER UPDATE OF bookmarkIds ON Tag
            FOR EACH ROW
            BEGIN
                UPDATE Tag
                SET numBookmarks = (LENGTH(NEW.bookmarkIds) - LENGTH(REPLACE(NEW.bookmarkIds, ',', '')) + 1)
                WHERE id = NEW.id;
            END;
        `;

        try {
            await tagRepo.execute(sql1);
        } catch (error) {
            if (!error.message.includes("duplicate column name")) {
                throw error;
            }
        }
        await tagRepo.execute(sql2);
        await tagRepo.execute(sql3);
    }
    const userRepo = await this.getRepository(LinkstashUserRepository);
    const numUsers = (await userRepo.count()).count;

    if (numUsers === 0) {
      console.log('Empty users table. Creating default user...');
      const password = await hash('password', await genSalt());
      const savedUser = await userRepo.create({ username: 'admin' });

      // sqlite connector wont return id correctly into savedUser , so we have to retrieve
      const latestUser = await userRepo.findOne({
          where: { username: 'admin' },
          order: ['id DESC'],
      });
      if (!latestUser) {
          throw new Error("Failed to retrieve created user.");
      }
      await userRepo.userCredentials(latestUser.id).create({ password });
      await userRepo.userPermissions(latestUser.id).create({ isUserAdmin: true });
      console.log("User 'admin' created with ID:", latestUser.id);
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

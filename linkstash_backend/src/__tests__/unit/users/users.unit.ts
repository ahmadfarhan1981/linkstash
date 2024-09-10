import {JWTService, TokenServiceConstants} from '@loopback/authentication-jwt';
import {expect} from '@loopback/testlab';

import {UserController} from '../../../controllers';
import {LinkstashUserRepository, UserCredentialsRepository} from '../../../repositories';
import {LinkStashUserService} from '../../../services';
import {Credentials} from '../../../types';
import {givenAppendCredential, givenAppendUser, givenEmptyDatabase} from '../../helpers/database.helpers';

describe('Controller (unit)', () => {
  const hashForTheStringPassword = '$2a$10$qbRysbLko8WYFaHv9eQwV.XIbvObJLEO6lFzpG84g1Z9TFbw.eBB6';
  let userRepo: LinkstashUserRepository;
  let credRepo: UserCredentialsRepository;
  beforeEach(async function () {
    const {user, credentials} = await givenEmptyDatabase();
    userRepo = user;
    credRepo = credentials;
  });

  describe('Users', () => {
    describe('/login', () => {
      it('return access token with correct credentials', async () => {
        await givenAppendUser(userRepo, {username: 'paan', id: 'f9048fc2-a3ec-45eb-8c93-23606df07cf0'});
        await givenAppendCredential(credRepo, {password: hashForTheStringPassword, userId: 'f9048fc2-a3ec-45eb-8c93-23606df07cf0'});
        const userService = new LinkStashUserService(userRepo);
        const userController = new UserController(
          new JWTService(TokenServiceConstants.TOKEN_SECRET_VALUE, TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE),
          userService,
          userRepo,
          undefined,
        );
        const givenCrendentials: Credentials = {password: 'password', username: 'paan'};
        const result = await userController.login(givenCrendentials);
        expect(result.token).to.not.empty();
      });
      it('should not leak info with wrong credentials', async () => {
        await givenAppendUser(userRepo, {username: 'paan', id: 'f9048fc2-a3ec-45eb-8c93-23606df07cf0'});
        await givenAppendCredential(credRepo, {password: hashForTheStringPassword, userId: 'f9048fc2-a3ec-45eb-8c93-23606df07cf0'});
        const userService = new LinkStashUserService(userRepo);
        const userController = new UserController(
          new JWTService(TokenServiceConstants.TOKEN_SECRET_VALUE, TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE),
          userService,
          userRepo,
          undefined,
        );
        const givenInvalidCrendentialsWithWrongPassword: Credentials = {password: 'password1', username: 'paan'};
        const givenInvalidCrendentialsWithWrongUsername: Credentials = {password: 'password', username: 'paan1'};
        const givenInvalidCrendentialsWithWrongUsernameAndPassword: Credentials = {password: 'password1', username: 'paan1'};
        await expect(userController.login(givenInvalidCrendentialsWithWrongPassword)).rejectedWith('Invalid email or password.');
        await expect(userController.login(givenInvalidCrendentialsWithWrongUsername)).rejectedWith('Invalid email or password.');
        await expect(userController.login(givenInvalidCrendentialsWithWrongUsernameAndPassword)).rejectedWith('Invalid email or password.');
      });
      it('return valid token on login');
      describe('/whoami', () => {
        it('shows current logged in user given correct jwt');
        it('errors on expired token');
        it('errors on invalid token');
      });
    });
    describe('/signup', () => {
      it('creates new user on signup');
    });
    describe('/change-password', () => {
      it('allows user change own password');
      it('allows user to change any password if user is an user admin');
    });
    describe('DEL /user/${id}', () => {
      it('deletes user')
      it('doesnt leave any bookmarks, tags, archive, credentials and permissions behind for deleted users');
    });

  });
});

import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {LinkstashUserRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class PermissionsService {
  private userRepository : LinkstashUserRepository;
  constructor(@repository(LinkstashUserRepository) userRepository : LinkstashUserRepository) {
    this.userRepository = userRepository;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const invalidCredentialsError = 'Invalid userId';
    const foundUser = await this.userRepository.findOne({
      where: {id: userId},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const permissions = await this.userRepository.userPermissions(userId).get()
    if(!permissions){
      //TODO unexpected to not have permission. add extra logging and error handling
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    return permissions.isUserAdmin
  }

  async chcekIsAllowed(userId: string, targetUserId:string): Promise<boolean> {
    const notAllowed= "Not allowed"
    const isUserAdmin = await this.isUserAdmin(userId)
    if(!isUserAdmin && (!userId || !(userId === targetUserId)) ){
      throw new HttpErrors.Unauthorized(notAllowed);
    }
    return true;
  }
}

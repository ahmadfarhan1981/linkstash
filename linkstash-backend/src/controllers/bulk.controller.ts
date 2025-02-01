// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BookmarkRepository, TagRepository, LinkstashUserRepository} from '../repositories';
import {LinkStashBookmarkService} from '../services';
import {del, requestBody, response, RestBindings} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId} from '@loopback/security';
import {bulkDeleteRequestBody, BulkDeleteResponse, bulkDeleteResponseSchema, UserProfile} from '../types';

// import {inject} from '@loopback/core';

@authenticate('jwt')
export class BulkController {
  constructor(@repository(BookmarkRepository) public bookmarkRepository: BookmarkRepository,
      @repository(TagRepository) public tagRepository: TagRepository,
      @repository(LinkstashUserRepository) public userRepository: LinkstashUserRepository,
      @service(LinkStashBookmarkService) public bookmarkService: LinkStashBookmarkService,) {}

       @del('/bookmarks/bulk')
        @response(200, {
          description: 'Bulk deletion accepted. See response for details',
          content: {
            'application/json': {
              schema: bulkDeleteResponseSchema,
            },
          },
        })
        async bulkDelete(
          @requestBody(bulkDeleteRequestBody) bulkDelete: {ids: string[]},
          @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
          @inject(RestBindings.Http.RESPONSE) res: Response,

        ): Promise<BulkDeleteResponse | void> {

          const results:BulkDeleteResponse = {success: [], failure: []};
          const ids = bulkDelete.ids;
          for (const id of ids) {
            try {
              const existing = await this.userRepository.bookmarks(currentUserProfile[securityId]).find({where: {id: Number.parseInt(id)}});
              if (existing.length <= 0) {
                results.failure.push({id: id.toString(), message: 'not_found'});
                continue;
              }
              await this.bookmarkService.removeBookmark(existing[0]);
              results.success.push(id.toString());
            } catch (error) {
              results.failure.push({id: id.toString(), message: `error: ${error.message}`});
            }
          }
          return results;
        }
}

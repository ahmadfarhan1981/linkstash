// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BookmarkRepository, TagRepository, LinkstashUserRepository} from '../repositories';
import {LinkStashBookmarkService} from '../services';
import {del, post, requestBody, response} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId} from '@loopback/security';
import {
  bulkDeleteRequestBody,
  BulkDeleteResponse,
  bulkDeleteResponseSchema,
  bulkTagAddRequestBody, BulkTagResult, bulkTagAddResponseSchema, generatorObject,
  UserProfile, bulkTagRemoveRequestBody, bulkTagRemoveResponseSchema,
} from '../types';



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
          @inject(SecurityBindings.USER) currentUserProfile: UserProfile
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

        @post('/bookmarks/tags/bulk')
        @response(200, {
          description: 'Bulk add accepted. See response for details',
          content:{
            'application/json': {
              schema: bulkTagAddResponseSchema,
            }
          }
        })
        async bulkTagAdd(
          @requestBody(bulkTagAddRequestBody) bulkTagAdd: {bookmarkIds: string[], tags: string[]},
          @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
        ): Promise<BulkTagResult | void> {
          const results:BulkTagResult = {success: [], failure: []};

          const generator: generatorObject = new generatorObject(bulkTagAdd.bookmarkIds, bulkTagAdd.tags)

          for(const [bookmarkId, tagName] of generator.generatePairs()){
            const  result = await this.bookmarkService.addTagToBookmarkAndUpdateTags(currentUserProfile.id, tagName, Number.parseInt(bookmarkId) )
            if(result.success){
              results.success.push({bookmarkId:bookmarkId, tag:tagName});
            }else{
              results.failure.push({bookmarkId:bookmarkId, tag:tagName, message: `status: ${result.status} \n error: ${result.message}`});
            }
          }
          return results;
        }

  @del('/bookmarks/tags/bulk')
  @response(200, {
    description: 'Bulk delete accepted. See response for details',
    content:{
      'application/json': {
        schema: bulkTagRemoveResponseSchema,
      }
    }
  })
  async bulkTagRemove(
    @requestBody(bulkTagRemoveRequestBody) bulkTagRemove: {bookmarkIds: string[], tags: string[]},
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<BulkTagResult | void> {

    const results:BulkTagResult = {success: [], failure: []};

    const generator: generatorObject = new generatorObject(bulkTagRemove.bookmarkIds, bulkTagRemove.tags)

    for(const [bookmarkId, tagName] of generator.generatePairs()){
      const  result = await this.bookmarkService.removeTagFromBookmarkAndUpdateTags(currentUserProfile.id, tagName, Number.parseInt(bookmarkId) )
      if(result.success){
        results.success.push({bookmarkId:bookmarkId, tag:tagName});
      }else{
        results.failure.push({bookmarkId:bookmarkId, tag:tagName, message: `status: ${result.status} \n error: ${result.message}`});
      }
    }
    return results;
  }
}

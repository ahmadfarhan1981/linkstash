import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {post, RequestBody, requestBody, RequestBodyParserOptions, response} from '@loopback/rest';
import {SecurityBindings, securityId} from '@loopback/security';
import {LinkStashBookmarkService, NetscapeBookmark, NetscapeBookmarkConverterService} from '../services';
import {UserProfile} from '../types';

@authenticate('jwt')
export class ImportController {
  constructor(@service(LinkStashBookmarkService) public bookmarkService: LinkStashBookmarkService) {}
  async parseFileUpload(request: RequestBodyParserOptions): Promise<RequestBody> {
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({storage});
    return new Promise<RequestBody>((resolve, reject) => {
      upload.any()(request, {} as any, (err: any) => {
        if (err) return reject(err);
        resolve({
          value: {
            files: request.files,
            fields: (request as any).fields,
          },
        });
      });
    });
  }

  @post('/import')
  @response(204, {
    description: 'Import a netscape format bookmark file',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            'x-ts-type': NetscapeBookmark,
          },
        },
      },
    },
  })
  async import(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody.file({
      description: 'Upload a netscape bookmark file',
      required: true,
    })
    request: RequestBodyParserOptions,
    @service(NetscapeBookmarkConverterService) bookmarkConverterService: NetscapeBookmarkConverterService,
  ): Promise<NetscapeBookmark[]> {
    const files = await this.parseFileUpload(request);
    const file = files.value.files[0];
    const bm = bookmarkConverterService.parseNetscapeBookmark(file.buffer.toString('utf-8'));
    for (const bookmark of bm) {
      await this.bookmarkService.createBookmark(currentUserProfile[securityId], bookmarkConverterService.createBookmark(bookmark));
    }
    return bm;
  }
}

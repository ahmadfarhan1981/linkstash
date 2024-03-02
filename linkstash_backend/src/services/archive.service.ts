import {/* inject, */ BindingScope, injectable} from '@loopback/core';

import {repository} from '@loopback/repository/dist/decorators';
import {Readability} from '@mozilla/readability';
import axios from 'axios';
import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import {Archive, Bookmark} from '../models';
import {BookmarkRepository} from '../repositories';
import {createHash} from 'node:crypto';
import {getModelSchemaRef} from '@loopback/rest';
async function download_resource(
  url: string,
  downloadLocation: string,
): Promise<{success: boolean; error: string}> {
  try {
    const response = await axios.get(url, {responseType: 'arraybuffer'});

    // TODO REFACTOR duplicate code

    const fullPath = downloadLocation.concat(fileNameFromUrl(url as string));
    if (!fs.existsSync(downloadLocation)) {
      fs.mkdirSync(downloadLocation, {recursive: true});
    }
    if (fs.existsSync(fullPath)) {
      // TODO archive versioning
      fs.unlinkSync(fullPath);
    }
    const content_to_write = Buffer.from(response.data, 'base64');
    fs.writeFileSync(fullPath, content_to_write, {flag: 'a+'});
    return {success: true, error: ''};
  } catch (error) {
    return {success: false, error: JSON.stringify(error)};
  }
}

/**
 *
 * @param url the url as a string
 * @returns the filename and extension ( e.g "filename.extension" from "http://subdomain.domain:port/path1/path2/filename.extension?query1=queryValue1&query2=queryValue2#fragmentId" )
 *
 * Gets the last path component from a URL string, excluding query and hash ID
 * Copied from: https://jsfiddle.net/zoxyoymn/10/ (https://stackoverflow.com/a/36381427)
 */
function fileNameFromUrl(url: string): string {
  let matches = url.match(/\/([^\/?#]+)[^\/]*$/);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return '';
}

@injectable({scope: BindingScope.TRANSIENT})
export class ArchiveService {
  constructor(
    /* Add @inject to inject parameters */
    @repository(BookmarkRepository)
    private bookmarkRepository: BookmarkRepository,
  ) {}

  /*
   * Add service methods here
   */

  async archive(bookmark: Bookmark): Promise<Archive | undefined> {
    try {
      const url = bookmark.url;
      const response = await axios.get(url);

      const doc = new JSDOM(response.data, {
        url: url,
      });
      const reader = new Readability(doc.window.document);
      const output = reader.parse();
      const content = output?.content ? output?.content : '';
      let parsed_doc = new JSDOM(content);

      const contentBeforePost = parsed_doc.serialize();
      const size = Buffer.byteLength(contentBeforePost, 'utf8');
      const hash = createHash('sha256').update(contentBeforePost).digest('hex');

      const archives = await this.bookmarkRepository
        .archives(bookmark.id)
        .find({order: ['version DESC'], limit: 1});

      const latestExisting = archives[0];

      const isHashChanged =
        !latestExisting
        || size !== latestExisting.Filesize
        || hash !== latestExisting.Hash;
      const isContentChanged =
        !latestExisting
        || isHashChanged
        || Buffer.compare(
          Buffer.from(contentBeforePost),
          Buffer.from(latestExisting.Content),
        ) !== 0;

      if( latestExisting && !isHashChanged && !isContentChanged )
          return latestExisting
      const collisionId =
        latestExisting && isHashChanged && isContentChanged
          ? latestExisting.CollisionId + 1
          : 0;
      const version = latestExisting ? latestExisting.Version + 1 : 0;

      // return true;

      const images = parsed_doc.window.document.querySelectorAll('img');
      /**
       * TODO rewrite the path of all resources ( images/pdfs etc)
       * fetch the resource and points the archive copy to the local relative path
       *
       */
      images.forEach(async img => {
        //some lazy loaded images uses the src data property to store the image source
        const image_src: string = img.src
          ? img.src
          : (img.dataset.src as string);
        const downloadLocation = `public/archive/${bookmark.id}/assets/${version}/`;
        const {success, error} = await download_resource(
          image_src,
          downloadLocation,
        );
        //TODO configurations
        const host = 'http://localhost:3030';
        if (success) {
          //if downloaded the asset, then rewrite the path in the archive
          // TODO consider using abosolute path for the assets
          const local_image_path = `${host}/archive/${bookmark.id}/assets/${version}/${fileNameFromUrl(image_src as string)}`;
          img.src = local_image_path;
          img.dataset.src = local_image_path;
        }
      });

      const content_to_write = parsed_doc.serialize();
      const archive = {
        ArchiveId: `${bookmark.id}-${version}`,
        Content: content_to_write,
        ContentBeforeProcess: contentBeforePost,
        Hash: hash,
        Filesize: size,
        CollisionId: collisionId,
        DateRetrieved: Date(),
        LastChecked: Date(),
        Version: version,
        bookmarkId: bookmark.id as number,
      };

      return this.bookmarkRepository.archives(bookmark.id).create(archive);
    } catch (error) {
      // TODO Logging
      console.log(error);
    }
  }
}

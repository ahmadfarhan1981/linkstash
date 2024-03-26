import {/* inject, */ BindingScope, injectable} from '@loopback/core';

import {repository} from '@loopback/repository/dist/decorators';
import {Readability} from '@mozilla/readability';
import axios from 'axios';
import {JSDOM} from 'jsdom';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import {Archive, Bookmark} from '../models';
import {BookmarkRepository} from '../repositories';
async function downloadResource(url: string, downloadLocation: string): Promise<{success: boolean; error: string}> {
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
    const contentToWrite = Buffer.from(response.data, 'base64');
    fs.writeFileSync(fullPath, contentToWrite, {flag: 'a+'});
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
  const matches = url.match(/\/([^\/?#]+)[^\/]*$/);
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
      const parsedDoc = new JSDOM(content);

      const contentBeforePost = parsedDoc.serialize();
      const size = Buffer.byteLength(contentBeforePost, 'utf8');
      const hash = createHash('sha256').update(contentBeforePost).digest('hex');

      const archives = await this.bookmarkRepository.archives(bookmark.id).find({order: ['version DESC'], limit: 1});

      const latestExisting = archives[0];

      const isHashChanged = !latestExisting || size !== latestExisting.Filesize || hash !== latestExisting.Hash;
      const isContentChanged = !latestExisting || isHashChanged || Buffer.compare(Buffer.from(contentBeforePost), Buffer.from(latestExisting.Content)) !== 0;

      if (latestExisting && !isHashChanged && !isContentChanged) return latestExisting;
      const collisionId = latestExisting && isHashChanged && isContentChanged ? latestExisting.CollisionId + 1 : 0;
      const version = latestExisting ? latestExisting.Version + 1 : 0;

      // return true;

      const images = parsedDoc.window.document.querySelectorAll('img');
      /**
       * TODO rewrite the path of all resources ( images/pdfs etc)
       * fetch the resource and points the archive copy to the local relative path
       *
       */
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      images.forEach( async img => {
        //some lazy loaded images uses the src data property to store the image source
        const imageSrc: string = img.src ? img.src : (img.dataset.src as string);
        const downloadLocation = `public/archive/${bookmark.id}/assets/${version}/`;
        const {success} = await downloadResource(imageSrc, downloadLocation);
        //TODO configurations
        const host = 'http://localhost:3030';
        if (success) {
          //if downloaded the asset, then rewrite the path in the archive
          // TODO consider using abosolute path for the assets
          const localImagePath = `${host}/archive/${bookmark.id}/assets/${version}/${fileNameFromUrl(imageSrc as string)}`;
          img.src = localImagePath;
          img.dataset.src = localImagePath;
        }
      });

      const contentToWrite = parsedDoc.serialize();
      const archive = {
        ArchiveId: `${bookmark.id}-${version}`,
        Content: contentToWrite,
        ContentBeforeProcess: contentBeforePost,
        Hash: hash,
        Filesize: size,
        CollisionId: collisionId,
        DateRetrieved: Date(),
        LastChecked: Date(),
        Version: version,
        bookmarkId: bookmark.id as number,
      };

      return await this.bookmarkRepository.archives(bookmark.id).create(archive);
    } catch (error) {
      // TODO Logging
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

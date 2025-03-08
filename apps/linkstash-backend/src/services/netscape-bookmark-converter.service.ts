import {BindingScope, injectable} from '@loopback/core';

import {Bookmark} from '../models';
import { JSDOM } from 'jsdom';

export class NetscapeBookmark {
  title: string;
  url?: string;
  addDate?: Date;
  description?: string;
  tags?: string[];
  private?: boolean;
  toRead?: boolean;
  children?: NetscapeBookmark[];
}

@injectable({scope: BindingScope.TRANSIENT})
export class NetscapeBookmarkConverterService {
  constructor(/* Add @inject to inject parameters */) {}
  // TODO refactor
  parseNetscapeBookmark(netscapeContent: string): NetscapeBookmark[] {
    const dom = new JSDOM(netscapeContent);
    const doc = dom.window.document;
    const result: NetscapeBookmark[] = [];
    function getBookmarkFromAnchor(a:Element):NetscapeBookmark{
      const addDate = a.getAttribute("ADD_DATE");
        const bookmark =  {
          title: a.textContent ?? "",
          url: a.getAttribute("HREF") ?? undefined,
          addDate: addDate ? new Date(parseInt(addDate) * 1000) : undefined,
          tags: a.getAttribute("TAGS")?.split(",") ?? undefined,
          private: a.hasAttribute("PRIVATE") && (a.getAttribute("PRIVATE") === "true" || a.getAttribute("PRIVATE") === "1"),
          toRead: a.hasAttribute("TOREAD") && (a.getAttribute("TOREAD") === "true" || a.getAttribute("TOREAD") === "1"),
        };

        bookmark.tags = bookmark.tags?.filter(tag => tag.trim() !== "");
        return bookmark;
    }

    function processFolder(h3:Element):NetscapeBookmark{
      const addDate = h3.getAttribute("ADD_DATE");
          const folder: NetscapeBookmark = {
            title: h3.textContent ?? "",
            addDate: addDate ? new Date(parseInt(addDate) * 1000) : undefined,
            children: [],
          };
          let sibling = h3.nextSibling;
          while (sibling) {
            if (sibling.nodeName === "DL" || sibling.nodeName === "P") {
              sibling.childNodes.forEach((child) => {
                if (child.nodeType === 1) { // Element node
                  const parsedChild = parseElement(child as Element);
                  if (parsedChild) {
                    folder.children!.push(parsedChild);
                  }
                }
              });
            }
            sibling = sibling.nextSibling;
          }
          return folder;
    }
    function processDT(dt:Element):NetscapeBookmark | null {
      const folderTitle = dt.getElementsByTagName("H3")[0];
      if (folderTitle) {
        return processFolder(folderTitle)
      }
      const childAnchor = dt.getElementsByTagName("A")[0];
      if (childAnchor) {
        const bookmark = parseElement(childAnchor);
        if (bookmark) {
          const nextSibling = dt.nextSibling;
          if (nextSibling && nextSibling.nodeName === "DD") {
            bookmark.description = nextSibling.textContent ?? "";
          }
          return bookmark;
        }
      }
      return null;
    }
    function parseElement(element: Element): NetscapeBookmark | null {
      if (element.tagName === "A") {
        return getBookmarkFromAnchor(element)
      } else if (element.tagName === "DT") {
        return processDT(element)
      }
      return null;
    }

    function flattenBookmarks(bookmarks: NetscapeBookmark[], path: string = ""): NetscapeBookmark[] {
      const flattened: NetscapeBookmark[] = [];
      bookmarks.forEach((bookmark) => {
        if (bookmark.children && bookmark.children.length > 0) {
          const folderPath = path ? `${path} > ${bookmark.title}` : bookmark.title;
          flattened.push(...flattenBookmarks(bookmark.children, folderPath));
        } else {
          if (path) {
            bookmark.description = (bookmark.description ?? "") + ` Originally under ${path}`;
          }
          flattened.push(bookmark);
        }
      });
      return flattened;
    }

    const dlElement = doc.getElementsByTagName("DL")[0];
    if (dlElement) {
      dlElement.childNodes.forEach((child) => {
        if (child.nodeType === 1) { // Element node
          const bookmark = parseElement(child as Element);
          if (bookmark) {
            result.push(bookmark);
          }
        }
      });
    }

    return flattenBookmarks(result);
  }

  createBookmark(netscapeBookmark:NetscapeBookmark):Bookmark{
    return new Bookmark({
      url: netscapeBookmark.url,
      title: netscapeBookmark.title,
      created: netscapeBookmark.addDate,
      description: netscapeBookmark.description,
      tagList: netscapeBookmark.tags,
      //TODO unread and privte
    });

  }
}

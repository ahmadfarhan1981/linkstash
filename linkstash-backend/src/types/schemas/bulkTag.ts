export type BulkTagResult = {
  success: {bookmarkId: string, tag: string}[],
  failure: {bookmarkId: string, tag: string, message: string}[],
};
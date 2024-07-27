export type Bookmark = {
  id?: string;
  url?: string;
  description?: string;
  created?: Date;
  title?: string;
  tagList?: string[];
  archive?: string;
  archiveCount: { count:number }
};

export type Archive = {
  "ArchiveId": string;
  "Version": number;
  "DateRetrieved": Date;
  "LastChecked": Date,
  "Hash": string
  "Filesize": 10393,
  "CollisionId": 0,
  "Content": string
  "bookmarkId": string
}

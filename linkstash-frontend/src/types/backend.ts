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
  "Filesize": number,
  "CollisionId": number,
  "Content": string
  "bookmarkId": string
}

export type User = {
  "id":string;
  "username": string; 
  "userPermissions": {
    "isUserAdmin": boolean
  }
}

import {LinkStashUser, UserCredentials} from '../../models';
import {ArchiveRepository, BookmarkRepository, TagRepository, UserRepository} from '../../repositories';

import {UserCredentialsRepository} from '@loopback/authentication-jwt';
import {Getter} from '@loopback/core';
import {testdb} from '../fixtures/datasources/testing.datasource';

export async function givenEmptyDatabase() {
  let user: UserRepository;
  let tag: TagRepository;
  let credentials: UserCredentialsRepository;
  let bookmark: BookmarkRepository;
  let archive: ArchiveRepository;
  user = new UserRepository(
    testdb,
    async () => credentials,
    async () => bookmark,
    async () => tag,
  );
  tag = new TagRepository(
    testdb,
    async () => user,
    async () => bookmark,
  );
  credentials = new UserCredentialsRepository(testdb);
  bookmark = new BookmarkRepository(
    testdb,
    async () => user,
    async () => archive,
  );
  archive = new ArchiveRepository(testdb, async () => bookmark);

  await user.deleteAll();
  await tag.deleteAll();
  await credentials.deleteAll();
  await bookmark.deleteAll();
  await archive.deleteAll();

  return {user, tag, credentials, bookmark, archive};
}

export function givenUserData(data?: Partial<LinkStashUser>) {
  const defaultUserData: LinkStashUser = new LinkStashUser({
    username: 'a.username',
    id: 'f9048fc2-a3ec-45eb-8c93-23606df07cf0',
  });
  return Object.assign(defaultUserData, data);
}
export function givenCredentialData(data?: Partial<UserCredentials>) {
  const defaultCredentialsData: UserCredentials = new UserCredentials({
    id: '18de35b4-8243-4773-a645-ea1de15bb0eb',
    password: '$2a$10$qbRysbLko8WYFaHv9eQwV.XIbvObJLEO6lFzpG84g1Z9TFbw.eBB6',
    userId: 'f9048fc2-a3ec-45eb-8c93-23606df07cf0',
  });

  return Object.assign(defaultCredentialsData, data);
}

export async function givenUser(credentials: Getter<UserCredentialsRepository>, bookmark: Getter<BookmarkRepository>, tag: Getter<TagRepository>, data?: Partial<LinkStashUser>) {
  return new UserRepository(testdb, credentials, bookmark, tag).create(givenUserData(data));
}

export async function givenAppendUser(userRepo: UserRepository, data?: Partial<LinkStashUser>) {
  const user = givenUserData(data);
  return userRepo.create(user);
}
export async function givenAppendCredential(credRepo: UserCredentialsRepository, data?: Partial<UserCredentials>) {
  return credRepo.create(givenCredentialData(data));
}

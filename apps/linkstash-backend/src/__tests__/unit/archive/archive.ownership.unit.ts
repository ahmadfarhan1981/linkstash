import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {expect} from '@loopback/testlab';
import {ArchiveController} from '../../../controllers/archive.controller';
import {BulkController} from '../../../controllers/bulk.controller';
import {Archive, Bookmark} from '../../../models';
import {ArchiveService} from '../../../services';
import {Status, UserProfile} from '../../../types';
import {givenEmptyDatabase} from '../../helpers/database.helpers';

function profile(userId: string): UserProfile {
  return {
    [securityId]: userId,
    id: userId,
    name: userId,
  };
}

function archiveRow(bookmarkId: number, content: string): Partial<Archive> {
  return {
    ArchiveId: `archive-${bookmarkId}`,
    UserId: 'user-a',
    Version: 0,
    DateRetrieved: '2026-11-26',
    LastChecked: '2026-11-26',
    Hash: 'hash',
    Filesize: content.length,
    CollisionId: 0,
    Content: content,
    ContentBeforeProcess: content,
    bookmarkId,
  };
}

describe('archive ownership', () => {
  it('does not return or delete another user archive', async () => {
    const {bookmark, archive} = await givenEmptyDatabase();
    const saved = await bookmark.create({
      url: 'https://example.com/a',
      userId: 'user-a',
    });
    await archive.create(archiveRow(saved.id!, 'SECRET-ARCHIVE'));
    const controller = new ArchiveController(bookmark);
    const service = {removeLocalAssets() {}} as unknown as ArchiveService;

    await expect(
      controller.findArchives(saved.id!, profile('user-b')),
    ).to.be.rejectedWith(HttpErrors.NotFound);
    await expect(
      controller.deleteArchives(saved.id!, service, profile('user-b')),
    ).to.be.rejectedWith(HttpErrors.NotFound);
    await expect(
      controller.getLatestArchive(saved.id!, profile('user-b')),
    ).to.be.rejectedWith(HttpErrors.NotFound);

    const own = await controller.findArchives(saved.id!, profile('user-a'));
    expect(own).to.have.length(1);
    expect(own[0].Content).to.equal('SECRET-ARCHIVE');
    const stillThere = await archive.find();
    expect(stillThere).to.have.length(1);
  });

  it('does not archive a bookmark that belongs to someone else, or reuse the previous one', async () => {
    const {bookmark} = await givenEmptyDatabase();
    const own = await bookmark.create({
      url: 'https://example.com/own',
      userId: 'user-a',
    });
    const other = await bookmark.create({
      url: 'https://example.com/other',
      userId: 'user-b',
    });
    const archived: number[] = [];
    const service = {
      archive: async (item: Bookmark) => {
        archived.push(item.id!);
        return {result: {success: true, status: Status.SUCCESS}};
      },
    } as unknown as ArchiveService;
    const controller = new BulkController(
      bookmark,
      undefined as never,
      undefined as never,
      undefined as never,
    );

    const result = await controller.bulkArchive(
      {bookmarkIds: [String(other.id), '99999', String(own.id)]},
      profile('user-a'),
      service,
    );

    expect(archived).to.eql([own.id]);
    expect(result.success).to.have.length(1);
    expect(result.failure.map(item => item.bookmarkId)).to.eql([
      String(other.id),
      '99999',
    ]);
  });
});

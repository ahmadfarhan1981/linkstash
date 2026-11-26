import {expect} from '@loopback/testlab';
import {localizeArchiveImages} from '../../../services';

describe('archive image downloads', () => {
  it('waits for every image download before the caller continues', async () => {
    const images = [
      {src: 'http://example.test/a.png', dataset: {} as {src?: string}},
      {src: '', dataset: {src: 'http://example.test/b.png'}},
    ];
    let finished = 0;
    await localizeArchiveImages(
      images,
      async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
        finished += 1;
        return true;
      },
      url => `local/${url}`,
    );
    expect(finished).to.equal(2);
    expect(images[0].src).to.equal('local/http://example.test/a.png');
    expect(images[1].src).to.equal('local/http://example.test/b.png');
    expect(images[1].dataset.src).to.equal('local/http://example.test/b.png');
  });
});

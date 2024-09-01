/* eslint-disable @typescript-eslint/no-invalid-this */
import {Client} from '@loopback/testlab';
import {LinkstashApplication} from '../..';
import {setupApplication} from './test-helper';

describe.skip('HomePage', function() {

  let app: LinkstashApplication;
  let client: Client;
  this.timeout(10000);
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  })

  it('exposes self-hosted explorer', async () => {
    await client
      .get('/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  })
});

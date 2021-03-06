import expect from '../expect';

const logServer = require('debug')('commander-periscope:server');
const logTest = require('debug')('commander-periscope:test');

export const newPageWithContext = async (browser) => {
  // TODO: Something that doesn't require using weird puppeteer internals.
  const { browserContextId } = await browser._connection.send('Target.createBrowserContext');
  const { targetId } = await browser._connection.send('Target.createTarget', { url: 'about:blank', browserContextId });
  const target = await browser._targets.get(targetId);
  expect(await target._initializedPromise, 'Failed to create target for page').to.equal(true);
  const page = await target.page();
  page._browserContextId = browserContextId;
  return page;
};

export async function closePageWithContext(browser, page) {
  if (page._browserContextId) {
    await browser._connection.send('Target.disposeBrowserContext', { browserContextId: page._browserContextId });
  }
  await page.close();
}

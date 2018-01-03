import puppeteer from 'puppeteer';
import expect from '../expect';
import {
  clickReadyButton, closePageWithContext, createCustomLobby, expectNoErrors, expectPagesValid, extractGame,
  extractState, extractUserId, initServer, joinCustomLobby, newPageWithContext
} from './puppeteerUtils';

// registerErrorHandlers();
// TODO: Start up app

const log = require('debug')('commander-periscope:test');

describe('Integration', function () {
  this.timeout(10000);
  let browser;
  let server;
  let pages;
  
  before(async () => {
    browser = await puppeteer.launch({});
    server = initServer();
  });
  
  beforeEach(async () => {
    const promises = [];
    for (let i = 0; i < 8; i++) {
      promises.push(newPageWithContext(browser));
    }
    pages = await Promise.all(promises);
    
    for (const page of pages) {
      page.pageErrors = [];
      page.on('pageerror', (e) => {
        page.pageErrors.push(e);
      });
    }
    const port = server.address().port;
    await Promise.all(pages.map(page => page.goto(`http://localhost:${port}`)));
  });
  
  afterEach(async () => {
    await Promise.all(pages.map((page) => closePageWithContext(browser, page)));
    pages = [];
  });
  
  after(async () => {
    await Promise.all(pages.map(page => page.close()));
    await browser.close();
    server.close();
    server._io.close();
    
    // TODO: something still isn't closed
  });
  
  it('each tab should have a different userId', async () => {
    await expectPagesValid(pages);
    
    const userIds = new Set(await Promise.all(pages.map(page => extractUserId(page))));
    expect(userIds.size).to.equal(pages.length);
  });
  
  it('play through a game', async () => {
    await expectPagesValid(pages);
    
    const redTeam = pages.slice(0, 4);
    const blueTeam = pages.slice(4, 8);
    
    // First player create the lobby
    const lobbyId = await createCustomLobby(pages[0]);
    expect(lobbyId).to.exist;
    
    log(`lobby created: ${lobbyId}`);
    
    // Everyone else join the lobby
    await Promise.all(pages.slice(1).map(async (page) => joinCustomLobby(page, lobbyId)));
    
    // Make sure everyone sees all players in the lobby
    for (const page of pages) {
      const state = await extractState(page);
      expect(state.lobby.players).to.include(state.userId);
      expect(state.lobby.players).to.have.lengthOf(pages.length);
    }
    
    log(`all players in lobby`);
    
    // TODO: Test changing usernames
    
    // for (let i = 0; i < 4; i++) {
    //   await redTeam[i].click(`#red-${ALL_ROLES[i]}`);
    //   await blueTeam[i].click(`#blue-${ALL_ROLES[i]}`);
    // }
    
    await redTeam[0].click('#red-captain');
    await redTeam[1].click('#red-first_mate');
    await redTeam[2].click('#red-engineer');
    await redTeam[3].click('#red-radio_operator');
    
    await blueTeam[0].click('#blue-captain');
    await blueTeam[1].click('#blue-first_mate');
    await blueTeam[2].click('#blue-engineer');
    await blueTeam[3].click('#blue-radio_operator');
    
    expectNoErrors(pages);
    
    log(`all players have roles`);
    
    for (const page of pages) {
      await clickReadyButton(page);
      await page.waitFor(50); // TODO: Why do we need this? We should be able to do these simultaneously
    }
    
    expectNoErrors(pages);
    
    log(`all players ready`);
    
    await redTeam[0].waitFor(1000);
    
    expect(await redTeam[0].$('#captain-page')).to.exist;
    expect(await redTeam[1].$('#first-mate-page')).to.exist;
    expect(await redTeam[2].$('#engineer-page')).to.exist;
    expect(await redTeam[3].$('#radio-operator-page')).to.exist;
    expect(await blueTeam[0].$('#captain-page')).to.exist;
    expect(await blueTeam[1].$('#first-mate-page')).to.exist;
    expect(await blueTeam[2].$('#engineer-page')).to.exist;
    expect(await blueTeam[3].$('#radio-operator-page')).to.exist;
    
    log(`all players on game pages`);
    
    await blueTeam[0].click('.Cell:nth-of-type(3)');
    await extractGame(blueTeam[0])
    // TODO: Verify game started
    // TODO: Select Locations
    // TODO: Play game
  });
});
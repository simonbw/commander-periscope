import puppeteer from 'puppeteer';
import { PLAYERS, TEAMS } from '../../src/common/fields/CommonFields';
import { READIED } from '../../src/common/fields/LobbyFields';
import { LOBBY, USER_ID } from '../../src/common/fields/StateFields';
import CustomLobbies from '../../src/server/resources/CustomLobbies';
import expect from '../expect';
import { expectNoErrors, expectTitle } from './PageAssertions';
import { extractState, extractUserId } from './PageExtractors';
import { clickReadyButton, createCustomLobby, joinCustomLobby, waitForJoinGame } from './PuppeteerActions';
import { closePageWithContext, initServer, newPageWithContext } from './PuppeteerUtils';

// registerErrorHandlers();

const log = require('debug')('commander-periscope:test');

describe('Integration', function () {
  this.timeout(30 * 1000);
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
    await expectTitle(pages);
    
    const userIds = new Set(await Promise.all(pages.map(page => extractUserId(page))));
    expect(userIds.size).to.equal(pages.length);
  });
  
  it('play through a game', async () => {
    await expectTitle(pages);
    
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
      const players = state.getIn([LOBBY, PLAYERS]);
      expect(players).to.include(state.get(USER_ID));
      expect(players).to.have.size(pages.length);
    }
    
    log(`all players in lobby`);
    
    // TODO: Test leaving lobby
    
    // TODO: Test changing usernames
    
    await Promise.all([
      redTeam[0].click('#red-captain'),
      redTeam[1].click('#red-first_mate'),
      redTeam[2].click('#red-engineer'),
      redTeam[3].click('#red-radio_operator'),
      blueTeam[0].click('#blue-captain'),
      blueTeam[1].click('#blue-first_mate'),
      blueTeam[2].click('#blue-engineer'),
      blueTeam[3].click('#blue-radio_operator'),
    ]);
    
    const lobbyTeams = (await CustomLobbies.get(lobbyId, true)).get(TEAMS); // wait for all these updates to finish
    expect(lobbyTeams.every(team => team.every(player => player)), lobbyTeams).to.equal(true);
    
    log(`all players have roles`);
    expectNoErrors(pages);
    
    for (const page of pages) {
      await clickReadyButton(page); // TODO: Why do these have to be synchronous?
    }
    // await Promise.all(pages.map(page => clickReadyButton(page)));
    
    const lobby = await CustomLobbies.get(lobbyId, true);
    expect(lobby.get(READIED)).to.have.size(8);
    
    log(`all players ready`);
    expectNoErrors(pages);
    
    await Promise.all(pages.map(waitForJoinGame));
    
    expectNoErrors(pages);
    log(`all players have joined game`);
    
    await Promise.all([
      redTeam[0].waitForSelector('#captain-page', { timeout: 500 }),
      redTeam[1].waitForSelector('#first-mate-page', { timeout: 500 }),
      redTeam[2].waitForSelector('#engineer-page', { timeout: 500 }),
      redTeam[3].waitForSelector('#radio-operator-page', { timeout: 500 }),
      blueTeam[0].waitForSelector('#captain-page', { timeout: 500 }),
      blueTeam[1].waitForSelector('#first-mate-page', { timeout: 500 }),
      blueTeam[2].waitForSelector('#engineer-page', { timeout: 500 }),
      blueTeam[3].waitForSelector('#radio-operator-page', { timeout: 500 }),
    ]);
    
    expectNoErrors(pages);
    log(`all players on game pages`);
    
    // Select locations
    // TODO: Select Locations
    
    // expectNoErrors(pages);
    
    // await Promise.all(pages.map(waitForGameStarted));
    // log(`game started`);
    
    // TODO: Play rest of game
    // TODO: Test losing connection
    // TODO: Test refresh page
  });
});
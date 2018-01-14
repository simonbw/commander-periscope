import expect from '../expect';

export async function expectTitle(pages, expectedTitle = 'Commander Periscope') {
  if (!Array.isArray(pages)) {
    pages = [pages];
  }
  const titles = await Promise.all(pages.map(page => page.title()));
  for (const title of titles) {
    expect(title).to.equal(expectedTitle);
  }
}

export function expectNoErrors(pages) {
  if (!Array.isArray(pages)) {
    pages = [pages];
  }
  for (const page of pages) {
    if (page.pageErrors.length > 0) {
      throw new Error(`Client error: ${page.pageErrors[0]}`)
    }
  }
}
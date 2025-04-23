import { test, expect } from '@playwright/test';

const expectTexts = {
  title: /Hassi Blog/,
  authorsTitle: "Autores",
}

const uiTexts = {
  authorsButton: "Autores"
}

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(expectTexts.title);
});

test('site being redirected and loading the authors page', async ({ page }) => {
  await page.goto('/');

  
  const link = await page.getByRole('link', { name: uiTexts.authorsButton });
  link.click(); // .click right after getting by role does not work!

  await page.waitForNavigation('networkidle');
  // await page.waitForURL('/authors');

  const title = await page.title();
  expect(title).toContain(uiTexts.authorsButton);
});

test('has at least one post and redirects to post', async ({ page }) => {
  await page.goto('/')

  const liPostLocator = page.locator('ul.post-list > li')

  
  const listItem = liPostLocator.first();
  
  const anchor = listItem.locator('a').first();
  const isAnchorVisible = await anchor.isVisible();
  
  if (isAnchorVisible) {
    const name = await anchor.textContent();
    const href = await anchor.getAttribute('href'); 

    await anchor.click();
    
    await page.waitForURL(href);
    
    const title = await page.title();
    expect(title).toContain(name.trim());
  } else {
    console.log(`No visible anchor found in home`);
  }
})

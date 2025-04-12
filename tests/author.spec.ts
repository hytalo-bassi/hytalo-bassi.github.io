import { test, expect } from '@playwright/test';

const expectedTexts = {
    authorsTitle: /Autores/
}

const uiTexts = {
    relMeLink: "ler mais"
}

test("has title", async ({ page }) => {
    await page.goto("/authors")

    await expect(page).toHaveTitle(expectedTexts.authorsTitle)
})

test.describe.serial("sequential tests", () => {
    test("has at least one author about-self", async ({ page }) => {
        await page.goto("/authors")
        const aboutSelfCount = await page.locator("div.about-self").count()
    
        expect(aboutSelfCount).toBeGreaterThanOrEqual(1)
    })

    test("has link to author", async ({ page }) => {
        await page.goto("/authors")
        const authorName = await page.locator("div.banner")
            .getByRole("heading")
            .first()
            .textContent()

        const relMe = page.getByRole("link", { name: uiTexts.relMeLink })
            .first()
        const href = await relMe.getAttribute("href")

        await relMe.click()

        if (!href)
            throw new Error("Missing href attribute!");
        
        if (!authorName)
            throw new Error("Missing author name!");
            
        await page.waitForURL(href)

        await expect(page).toHaveTitle(RegExp(`${authorName}`, "i"))
    })
})

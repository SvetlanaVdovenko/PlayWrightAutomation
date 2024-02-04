const {test, expect} = require('@playwright/test')

test('Pop-up validations', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    
    //await page.goto('https://www.google.com/');
    //await page.goBack();
    //await page.goForward();
    // handling visible//non-visible elements
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    // handling js pop-ups
    page.on('dialog',dialog => dialog.accept())
    await page.locator("#confirmbtn").click();
    // handling mouse hover
    await page.locator("#mousehover").hover();
    // handling iframes
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);
})  
const {test, expect} = require('@playwright/test')

test('Browser Context Playwright test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    const userName = page.locator('#username');
    const password = page.locator('#password');
    const singIn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");
   
    //console.log(await page.title());
    await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');
   

   await userName.fill('learning');
   await password.fill('learning');
   await singIn.click();
   //wait until locator will shown on the page
   // console.log(await page.locator("[style*='block']").textContent());
   await expect(await page.locator("[style*='block']")).toContainText('Incorrect');
   await userName.fill('');
   await userName.fill('rahulshettyacademy')
   await singIn.click();
  
   console.log(await cardTitles.first().textContent());
   console.log(await cardTitles.nth(1).textContent());
   const allTitles = await cardTitles.allTextContents();
   console.log(allTitles);
});

test('PagePlaywright test', async ({page}) => {
    await page.goto('https://google.com');
    //console.log(await page.title());
    await expect(page).toHaveTitle('Google');
});

test('Home work', async ({page}) =>{
    await page.goto('https://rahulshettyacademy.com/client');
    const email = page.locator('#userEmail');
    const password = page.locator('#userPassword');
    const loginBtn = page.locator('#login');

    await email.fill('test0901@harakirimail.com');
    await password.fill('Testing.123');
    await loginBtn.click();
    await page.waitForLoadState('networkidle');
    // if the step above doesn't work and returns the epty array
    // another solution:
    // const cardTitles = page.locator('.card-body b').last().waitFor();

    const cardTitles = page.locator('.card-body b')
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
})

test('UI Components', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userName = page.locator('#username');
    const password = page.locator('#password');
    const documentLink = page.locator("[href*='documents-request']");
    //static drop-down
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('consult');
    //radio-button
    await page.locator('.radiotextsty').last().click();
    await page.locator('#okayBtn').click();
    await expect(page.locator('.radiotextsty').last()).toBeChecked();
    //check-box
    await page.locator('#terms').click();
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck();
    expect(await page.locator('#terms').isChecked()).toBeFalsy();
    //check attribute value
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
   
})

test("Child windows handling", async ({browser}) =>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userName = page.locator('#username');
    const documentLink = page.locator("[href*='documents-request']");
    
    const [newPage] = await Promise.all(
    [
        context.waitForEvent('page'),
        documentLink.click(),
    ]);
    const text = await newPage.locator('.red').textContent();
    const arrayText = text.split('@');
    const domain = arrayText[1].split(' ')[0];
    
    await userName.fill(domain);
    console.log(await userName.textContent());
})  

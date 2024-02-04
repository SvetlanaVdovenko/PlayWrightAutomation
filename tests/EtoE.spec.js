const {test, expect} = require('@playwright/test');

test('End to End test', async ({page}) =>{
    // Login to the app
    await page.goto('https://rahulshettyacademy.com/client');
    const email = page.locator('#userEmail');
    const password = page.locator('#userPassword');
    const loginBtn = page.locator('#login');
    const userEmail = 'test0901@harakirimail.com';
    await email.fill(userEmail);
    await password.fill('Testing.123');
    await loginBtn.click();
    //Add a product to the cart
    await page.waitForLoadState('networkidle');
    const cardTitles = page.locator('.card-body b')
    const allTitles = await cardTitles.allTextContents();
    //console.log(allTitles);
    const productName = 'ZARA COAT 3';
    const productsArr = page.locator('.card-body');
    const productCount = await productsArr.count();
    for(let i = 0; i < productCount; i++) {
       if(await productsArr.nth(i).locator('b').textContent() === productName) {
            await productsArr.nth(i).locator('text= Add To Cart').click();
            break;
       }
    }
    //Go to the cart
    await page.locator("[routerlink*='cart']").click();
    await page.locator('div li').first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    //Go to the Checkoout
    await page.locator('text=Checkout').click();
    await page.locator("[placeholder*='Country']").pressSequentially('ind');
    const dropdown = page.locator(".ta-item");
    await dropdown.first().waitFor();
    const optionsCount = await dropdown.count();
    for(let i = 0; i< optionsCount; i++){
        //console.log(await dropdown.nth(i).textContent());
        if(await dropdown.nth(i).textContent() === " India"){
            await dropdown.nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(userEmail);

    await page.locator('input[type="text"]').first().fill('4111111111111111');
    await page.getByRole('combobox').first().selectOption('03');
    await page.getByRole('combobox').nth(1).selectOption('28');
    await page.locator('input[type="text"]').nth(1).fill('123');
    await page.locator('input[type="text"]').nth(2).fill('test');
    await page.getByText('Place Order').click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    //console.log(orderId);

    await page.locator(".btn-custom[routerlink='/dashboard/myorders']").click();
   
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");

    for( let i = 0; i < await rows.count(); i++){
        const rowId = await rows.nth(i).locator("th").textContent();
        if(orderId.includes(rowId)){
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    
    const OrderIdDetailsPage = await page.locator(".col-text.-main").textContent();
    console.log(orderId);
    console.log(OrderIdDetailsPage);
    await expect(orderId.includes(OrderIdDetailsPage)).toBeTruthy();


})
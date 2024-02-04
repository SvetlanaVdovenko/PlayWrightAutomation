const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils')
const loginPayLoad = {userEmail: "test0901@harakirimail.com",userPassword: "Testing.123"};
const orderPayload = {orders:[{country: "India",productOrderedId: "6581ca399fd99c85e8ee7f45"}]};
let response;

test.beforeAll( async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext,loginPayLoad);
    response = await apiUtils.createOrder(orderPayload);
    
})

test('End to End test', async ({page}) =>{
 
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
   
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
   
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");

    for( let i = 0; i < await rows.count(); i++){
        const rowId = await rows.nth(i).locator("th").textContent();
        if(response.orderId.includes(rowId)){
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    
    const OrderIdDetailsPage = await page.locator(".col-text.-main").textContent();
    console.log(OrderIdDetailsPage);
    await expect(response.orderId.includes(OrderIdDetailsPage)).toBeTruthy();


})
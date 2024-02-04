const { test, expect } = require('@playwright/test');
const {POManager} = require('../pageObjects/POManager');

test('End to End test', async ({ page }) => {

    const username = 'test0901@harakirimail.com';
    const password = 'Testing.123';
    const productName = 'ZARA COAT 3';
    const cardNumber = '4111111111111111';
    const month = '03';
    const year = '28';
    const cvv = '123';
    const comment = 'test';
    let orderId;

    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, password);
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProduct(productName);
    await dashboardPage.navigateToCart();
    const cartPage = poManager.getCartPage();
    await cartPage.isProductAdded(productName);
    await cartPage.goToCheckout();
    const checkoutPage = poManager.getCheckoutPage();
    await checkoutPage.fillOrderData(cardNumber, month, year, cvv, comment);
    orderId = await checkoutPage.placeOrderAndGetOrderId();

    await page.locator(".btn-custom[routerlink='/dashboard/myorders']").click();

    await page.locator("tbody").waitFor();

    const rows = await page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const rowId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const OrderIdDetailsPage = await page.locator(".col-text.-main").textContent();
    console.log(orderId);
    console.log(OrderIdDetailsPage);
    await expect(orderId.includes(OrderIdDetailsPage)).toBeTruthy();


})
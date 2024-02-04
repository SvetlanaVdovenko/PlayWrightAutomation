const {test, expect} = require('@playwright/test');
class CartPage {
    constructor(page){
        this.page = page;
        this.addedProduct = page.locator('div li');
        this.checkout = page.locator('text=Checkout');
    }
    
    async isProductAdded(productName){
        await this.addedProduct.first().waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy();
    }

    async goToCheckout(){
        await this.checkout.click();
    }

    getProductLocator(productName){
        return this.page.locator("h3:has-text('"+productName+"')");
    }
}
module.exports = {CartPage};
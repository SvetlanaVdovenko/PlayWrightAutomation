const {expect} = require('@playwright/test')

class CheckoutPage {
    constructor(page) {
        this.countryField = page.locator("[placeholder*='Country']");
        this.countryDropDown = page.locator(".ta-item");
        this.cardNumber = page.locator('input[type="text"]');
        this.cardExpiryDate = page.getByRole('combobox');
        this.cvv = page.locator('input[type="text"]');
        this.placeOrderBtn = page.getByText('Place Order');
        this.userEmail = page.locator(".user__name [type='text']").first();
        this.orderConfirmation = page.locator(".hero-primary");
        this.orderId =  page.locator(".em-spacer-1 .ng-star-inserted");
    }
    async fillOrderData(cardNumber, month, year, cvv, comment) {
        await this.countryField.pressSequentially('ind');
        await this.countryDropDown.first().waitFor();
        const optionsCount = await this.countryDropDown.count();
        for (let i = 0; i < optionsCount; i++) {
            if (await this.countryDropDown.nth(i).textContent() === " India") {
                await this.countryDropDown.nth(i).click();
                break;
            }
        }
        await this.cardNumber.first().fill(cardNumber);
        await this.cardExpiryDate.first().selectOption(month);
        await this.cardExpiryDate.nth(1).selectOption(year);
        await this.cvv.nth(1).fill(cvv);
        await this.cvv.nth(2).fill(comment);
    }

    async placeOrderAndGetOrderId() {
        await this.placeOrderBtn.click();
        await expect(this.orderConfirmation.toHaveText(" Thankyou for the order. "));
        const orderId = await this.orderId.textContent();
        return orderId;
    }

    async verifyEmail(username){
        await expect(this.userEmail.toHaveText(username));
    }
}

module.exports = {CheckoutPage};
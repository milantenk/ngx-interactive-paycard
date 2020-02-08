import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'card-form',
    templateUrl: 'card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})

export class CardFormComponent implements OnInit {

    cardNumberId = 'cardNumberId';
    cardNumberValue = '';
    cardNumberMaxLength = 19;
    displayedCardNumber = this.cardNumberValue;
    isCardNumberMasked = true;

    cardNameId = 'cardNameId';
    cardName = '';

    monthSelect = 'monthSelect';
    cardMonth = '';

    cardYear='';
    minCardYear;

    yearSelectId= 'yearSelectId';

    constructor() { }

    ngOnInit() { 
        this.minCardYear = new Date().getFullYear();
    }

    onCardNumberChange(cardNumber) {
        let value = cardNumber.replace(/\D/g, '')
        if ((/^3[47]\d{0,13}$/).test(value)) { // american express, 15 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
            this.cardNumberMaxLength = 17
        } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
            this.cardNumberMaxLength = 16
        } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
            this.cardNumberMaxLength = 19
        }
        this.displayedCardNumber = cardNumber;
    }

    onCardNumberFocus() {
        console.log('onCardNumberFocusCall')
        this.unMaskCardNumber();
    }

    onCardNumberBlur() {
        console.log('onCardNumberBlurCall')
        if (this.isCardNumberMasked) {
            this.maskCardNumber()
        }
    }

    onCardNameKeyPress(event) {
        this.cardName = event.target.value // TODO: Two way data binding?
        console.log(this.cardName)
        return ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))
    }

    maskCardNumber() {
        this.cardNumberValue = this.displayedCardNumber
        let arr = this.displayedCardNumber.split('')
        arr.forEach((element, index) => {
            if (index > 4 && index < 14 && element.trim() !== '') {
                arr[index] = '*'
            }
        })
        this.displayedCardNumber = arr.join('')
    }

    unMaskCardNumber() {
        this.displayedCardNumber = this.cardNumberValue
    }

    toggleCardNumberMask() {
        this.isCardNumberMasked = !this.isCardNumberMasked
        if (this.isCardNumberMasked) {
            this.maskCardNumber()
        } else {
            this.unMaskCardNumber()
        }
    }

    minCardMonth () {
        if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1
        return 1
      }

      generateMonthValue(n) {
        return n < 10 ? `0${n}` : n
      }
}

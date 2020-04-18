import { Component, OnInit } from '@angular/core';
import { CardModel} from '../shared/card-model'

@Component({
    selector: 'card-form',
    templateUrl: 'card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})

export class CardFormComponent implements OnInit {

    cardModel: CardModel;

    cardNumberId = 'cardNumberId';
    cardNumberMaxLength = 19;
    displayedCardNumber;
    isCardNumberMasked = true;

    cardNameId = 'cardNameId';

    monthSelect = 'monthSelect';

    cardYear = '';
    minCardYear;

    yearSelectId = 'yearSelectId';

    cardCcvId = 'cardCcvId';
    cardCcv;

    constructor() {
        this.cardModel = { cardNumber: '', cardName: '', expirationMonth: '', expirationYear: 0, ccv: 0 }
        this.displayedCardNumber = this.cardModel.cardNumber;
    }

    ngOnInit() {
        this.minCardYear = new Date().getFullYear();
    }

    onCardNumberChange(event) {
        let cardNumber = event.target.value;
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
        event.target.value = cardNumber;
        this.cardModel.cardNumber = cardNumber;
    }

    onCardNumberFocus() {
        this.unMaskCardNumber();
    }

    onCardNumberBlur() {
        if (this.isCardNumberMasked) {
            this.maskCardNumber()
        }
    }

    onCardNameKeyPress(event) {
        return ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))
    }

    maskCardNumber() {
        this.cardModel.cardNumber = this.displayedCardNumber
        let arr = this.displayedCardNumber.split('')
        arr.forEach((element, index) => {
            if (index > 4 && index < 14 && element.trim() !== '') {
                arr[index] = '*'
            }
        })
        this.displayedCardNumber = arr.join('')
    }

    unMaskCardNumber() {
        this.displayedCardNumber = this.cardModel.cardNumber
    }

    toggleCardNumberMask() {
        this.isCardNumberMasked = !this.isCardNumberMasked
        if (this.isCardNumberMasked) {
            this.maskCardNumber()
        } else {
            this.unMaskCardNumber()
        }
    }

    minCardMonth() {
        if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1
        return 1
    }

    generateMonthValue(n) {
        return n < 10 ? `0${n}` : n
    }
}

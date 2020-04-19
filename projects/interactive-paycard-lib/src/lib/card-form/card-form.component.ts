import { Component } from '@angular/core';
import { CardModel } from '../shared/card-model'

@Component({
    selector: 'card-form',
    templateUrl: 'card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})

export class CardFormComponent {

    cardModel: CardModel = { cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' };
    isCardNumberMasked = true;
    isCvvFocused = false;

    cardNumberMaxLength = 19;
    minCardYear = new Date().getFullYear();
    displayedCardNumber = this.cardModel.cardNumber; // The displayedCardNumber can be masked, the cardModel.cardNumber contains the real data

    cardNumberId = 'cardNumberId';
    cardNameId = 'cardNameId';
    monthSelect = 'monthSelect';
    yearSelectId = 'yearSelectId';
    cardCvvId = 'cardCvvId';

    onCardNumberChange($event) {
        let cardNumber: string = $event.target.value;
        let value = cardNumber.replace(/\D/g, '');
        if ((/^3[47]\d{0,13}$/).test(value)) { // american express, 15 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
            this.cardNumberMaxLength = 17;
        } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
            this.cardNumberMaxLength = 16;
        } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
            this.cardNumberMaxLength = 19;
        }
        this.displayedCardNumber = cardNumber;
        this.cardModel.cardNumber = cardNumber;
    }

    onCardNumberFocus() {
        this.unMaskCardNumber();
    }

    onCardNumberBlur() {
        if (this.isCardNumberMasked) {
            this.maskCardNumber();
        }
    }

    onCvvBlur() {
        this.isCvvFocused = false;
    }

    onCvvFocus() {
        this.isCvvFocused = true;
    }

    onCardNameKeyPress($event) {
        return (($event.charCode >= 65 && $event.charCode <= 90) || ($event.charCode >= 97 && $event.charCode <= 122) || ($event.charCode == 32));
    }

    onToggleCardNumberMask() {
        this.isCardNumberMasked = !this.isCardNumberMasked;
        if (this.isCardNumberMasked) {
            this.maskCardNumber();
        } else {
            this.unMaskCardNumber();
        }
    }

    onYearChange() {
        if (this.cardModel.expirationYear === this.minCardYear.toString()) {
            this.cardModel.expirationMonth = '';
        }
    }

    minCardMonth() {
        if (this.cardModel.expirationYear === this.minCardYear.toString()) {
            return new Date().getMonth() + 1;
        } else {
            return 1;
        }
    }

    generateMonthValue(n) {
        return n < 10 ? `0${n}` : n;
    }

    private maskCardNumber() {
        this.cardModel.cardNumber = this.displayedCardNumber;
        let arr = this.displayedCardNumber.split('');
        arr.forEach((element, index) => {
            if (index > 4 && index < 14 && element.trim() !== '') {
                arr[index] = '*';
            }
        })
        this.displayedCardNumber = arr.join('');
    }

    private unMaskCardNumber() {
        this.displayedCardNumber = this.cardModel.cardNumber;
    }
}

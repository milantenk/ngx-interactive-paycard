import { Component, Input } from '@angular/core';
import { CardModel } from '../shared/card-model'

@Component({
    selector: 'card-form',
    templateUrl: 'card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})

export class CardFormComponent {

    @Input() chipImgPath: string;
    @Input() logoImgPath: string;

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

    onCardNumberChange($event): void {
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
        $event.target.value = cardNumber; // The value in event has to be updated, otherwise the letter remains in the <input>
    }

    onCardNumberFocus(): void {
        this.unMaskCardNumber();
    }

    onCardNumberBlur(): void {
        if (this.isCardNumberMasked) {
            this.maskCardNumber();
        }
    }

    onCvvBlur(): void {
        this.isCvvFocused = false;
    }

    onCvvFocus(): void {
        this.isCvvFocused = true;
    }

    onCardNameKeyPress($event): boolean {
        return (($event.charCode >= 65 && $event.charCode <= 90) || ($event.charCode >= 97 && $event.charCode <= 122) || ($event.charCode == 32));
    }

    onToggleCardNumberMask(): void {
        this.isCardNumberMasked = !this.isCardNumberMasked;
        if (this.isCardNumberMasked) {
            this.maskCardNumber();
        } else {
            this.unMaskCardNumber();
        }
    }

    onYearChange(): void {
        if (this.cardModel.expirationYear === this.minCardYear.toString()) {
            this.cardModel.expirationMonth = '';
        }
    }

    minCardMonth(): number {
        if (this.cardModel.expirationYear === this.minCardYear.toString()) {
            return new Date().getMonth() + 1;
        } else {
            return 1;
        }
    }

    generateMonthValue(index: number): string {
        return index < 10 ? `0${index}` : index.toString();
    }

    private maskCardNumber(): void {
        this.cardModel.cardNumber = this.displayedCardNumber;
        let arr = this.displayedCardNumber.split('');
        arr.forEach((element, index) => {
            if (index > 4 && index < 14 && element.trim() !== '') {
                arr[index] = '*';
            }
        })
        this.displayedCardNumber = arr.join('');
    }

    private unMaskCardNumber(): void {
        this.displayedCardNumber = this.cardModel.cardNumber;
    }
}

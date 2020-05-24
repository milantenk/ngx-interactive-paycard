import { Component, Input, OnInit, Output, EventEmitter, Injectable, HostListener } from '@angular/core';
import { CardModel } from './shared/card-model';
import { FocusedElement } from './shared/focused-element';
import { Subject } from 'rxjs';

@Component({
  selector: 'interactive-paycard',
  templateUrl: 'interactive-paycard.component.html',
  styleUrls: ['./interactive-paycard.component.scss']
})
export class InteractivePaycardComponent implements OnInit {

  @Input() chipImgPath: string;
  @Input() logoImgPath: string;
  @Input() backBgImgPath: string;
  @Input() frontBgImgPath: string;
  @Input() cardNumberFormat: string;
  @Input() cardNumberMask: string;
  @Output() submitEvent = new EventEmitter<CardModel>();

  cardModel: CardModel = { cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' };
  isCardNumberMasked = true;

  cardNumberMaxLength = 19;
  minCardYear = new Date().getFullYear();
  displayedCardNumber = this.cardModel.cardNumber; // The displayedCardNumber can be masked, the cardModel.cardNumber contains the real data

  cardNumberId = 'cardNumberId';
  cardNameId = 'cardNameId';
  monthSelect = 'monthSelect';
  yearSelectId = 'yearSelectId';
  cardCvvId = 'cardCvvId';

  focusedElement: FocusedElement;

  ngOnInit() {
    if (new RegExp('[^# ]').test(this.cardNumberFormat)) {
      throw new Error('The card number format must contain only "#" and " " characters! Check the "cardNumberFormat" input parameter!');
    }
    if (new RegExp('[^# *]').test(this.cardNumberMask)) {
      throw new Error('The card number mask must contain only "#", "*" and " " characters! Check the "cardNumberMask" input parameter!');
    }
    if (this.cardNumberMask.length != this.cardNumberFormat.length) {
      throw new Error('The card number mask and the card number format must have the same length! Check the "cardNumberFormat" and the "cardNumberMask" input parameters!');
    }
  }

  onCardNumberChange($event): void {
    let cardNumber: string = $event.target.value;
    this.cardNumberMaxLength = this.cardNumberFormat.length;

    let newValues = [];
    let letterRegex = new RegExp('[^0-9]');
    cardNumber.split('').forEach((element, index) => {
      if (this.cardNumberFormat[index] == ' ' && element != ' ' && !(letterRegex.test(element))) {
        // if the typed number is at the border of a space, the space has to be added and the number itself
        newValues.push(' ');
        newValues.push(element);
      } else if (this.cardNumberFormat[index] == ' ' && element == ' ') {
        // if there is already a space in the number and in the placeholder, a space is needed
        newValues.push(' ');
      }
      else if (!(letterRegex.test(element))) {
        // only numbers are allowed
        newValues.push(element);
      }
    });
    cardNumber = newValues.join('').trim();

    this.displayedCardNumber = cardNumber;
    this.cardModel.cardNumber = cardNumber;
    $event.target.value = cardNumber; // The value in event has to be updated, otherwise the letter remains in the <input>
  }

  onCvvChange(event): void {
    this.cardModel.cvv = event.target.value.replace(/[^0-9]*/g, '');
    event.target.value = this.cardModel.cvv;
  }

  onCardNumberFocus(): void {
    this.unMaskCardNumber();
    this.focusedElement = FocusedElement.CardNumber;
  }

  onCardNameFocus(): void {
    this.focusedElement = FocusedElement.CardName;
  }

  onDateFocus(): void {
    this.focusedElement = FocusedElement.ExpirationDate;
  }

  onCvvFocus(): void {
    this.focusedElement = FocusedElement.CVV;
  }

  onBlur(): void {
    this.focusedElement = null;
  }

  onCardNumberBlur(): void {
    if (this.isCardNumberMasked) {
      this.maskCardNumber();
    }
    this.onBlur();
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

  onSubmitClick() {
    console.log(this.cardModel)
    this.submitEvent.emit(this.cardModel);
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
      if (this.cardNumberMask[index] == '*') {
        arr[index] = '*';
      }
    })
    this.displayedCardNumber = arr.join('');
  }

  private unMaskCardNumber(): void {
    this.displayedCardNumber = this.cardModel.cardNumber;
  }

}
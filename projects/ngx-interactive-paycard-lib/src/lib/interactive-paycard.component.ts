import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { CardModel } from './shared/card-model';
import { FocusedElement } from './shared/focused-element';
import { CardLabel,  FormLabel} from './shared';
import { DefaultComponentLabels } from './shared/default-component-labels';

@Component({
  selector: 'ngx-interactive-paycard',
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
  @Input()
  get cardLabels(): CardLabel { return this._cardLabels}
  set cardLabels(value: CardLabel | null) {
    this._cardLabels = value;
  }
  private _cardLabels: CardLabel = {
    expires: DefaultComponentLabels.CARD_EXPIRES,
    cardHolder: DefaultComponentLabels.CARD_HOLDER_NAME,
    fullName: DefaultComponentLabels.CARD_FULL_NAME,
    mm: DefaultComponentLabels.CARD_EXPIRATION_MONTH_FORMAT,
    yy: DefaultComponentLabels.CARD_EXPIRATION_YEAR_FORMAT
  };

  @Input()
  get formLabels(): FormLabel { return this._formLabels};
  set formLabels(value: FormLabel | null) {
    this._formLabels = value;
  }
  private _formLabels: FormLabel =  {
    cardNumber: DefaultComponentLabels.FORM_CARD_NUMBER,
    cardHolderName: DefaultComponentLabels.FORM_CARD_HOLDER_NAME,
    expirationDate: DefaultComponentLabels.FORM_EXPIRATION_DATE,
    expirationMonth: DefaultComponentLabels.FORM_EXPIRATION_MONTH,
    expirationYear: DefaultComponentLabels.FORM_EXPIRATION_YEAR,
    cvv: DefaultComponentLabels.FORM_CVV,
    submitButton: DefaultComponentLabels.FORM_SUBMIT_BUTTON
  };

  @Output() submitEvent = new EventEmitter<CardModel>();
  @ViewChild('cardNumberInput', { static: false }) cardNumberInputViewChild: ElementRef;

  cardModel: CardModel = { cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' };

  cardNumberMaxLength = 19;
  minCardYear = new Date().getFullYear();
  displayedCardNumber = this.cardModel.cardNumber; // The displayedCardNumber can be masked, the cardModel.cardNumber contains the real data
  displayedCvv = this.cardModel.cvv; // The displayed cvv can be masked

  cardNumberId = 'cardNumberId';
  cardNameId = 'cardNameId';
  monthSelect = 'monthSelect';
  yearSelectId = 'yearSelectId';
  cardCvvId = 'cardCvvId';

  focusedElement: FocusedElement;
  cardNumberFormatArray: string[];

  ngOnInit() {
    if (new RegExp('[^# ]').test(this.cardNumberFormat)) {
      throw new Error('The card number format must contain only "#" and " " characters! Check the "cardNumberFormat" input parameter!');
    }
    if (new RegExp('[^# *]').test(this.cardNumberMask)) {
      throw new Error('The card number mask must contain only "#", "*" and " " characters! Check the "cardNumberMask" input parameter!');
    }
    if (this.cardNumberMask.length !== this.cardNumberFormat.length) {
      throw new Error('The card number mask and the card number format must have the same length! \
      Check the "cardNumberFormat" and the "cardNumberMask" input parameters!');
    }
    this.cardNumberMaxLength = this.cardNumberFormat.length;
    this.cardNumberFormatArray = this.cardNumberFormat.split('');
  }

  onCardNumberChange($event): void {
    let cursorPosStart = $event.srcElement.selectionStart;
    let cursorPosEnd = $event.srcElement.selectionEnd;
    let processedCardNumber: string = $event.target.value;
    const newValues: string[] = [];
    const letterRegex = new RegExp('[^0-9]');
    const isCursorAtTheEnd = cursorPosEnd === processedCardNumber.length;
    const cardNumWithoutSpaceAsArray = processedCardNumber.replace(/ /g, '').split('');
    this.cardNumberFormatArray.forEach((format) => {
      if (cardNumWithoutSpaceAsArray.length > 0) {
        if (format === '#') {
          let isNumber: boolean;
          let character: string;
          do {
            character = cardNumWithoutSpaceAsArray.shift();
            isNumber = !(letterRegex.test(character));
            if (isNumber) {
              newValues.push(character);
            } else { // don't move the cursor, if a letter is removed
              cursorPosEnd--;
              cursorPosStart--;
            }
          } while (!isNumber && character !== undefined); // find the next number
        } else if (format === ' ') {
          newValues.push(' ');
        }
      }
    });
    processedCardNumber = newValues.join('').trim();
    this.displayedCardNumber = processedCardNumber;
    this.cardModel.cardNumber = processedCardNumber;
    $event.target.value = processedCardNumber; // The value in event has to be updated, otherwise the letter remains in the <input>
    if (!isCursorAtTheEnd) { // The cursor position has to be corrected because of the newly created string
      $event.srcElement.selectionEnd = cursorPosEnd;
      $event.srcElement.selectionStart = cursorPosStart;
    }
  }

  onCvvChange(event): void {
    this.cardModel.cvv = event.target.value.replace(/[^0-9]*/g, '');
    this.displayedCvv = this.cardModel.cvv;
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
    this.unMaskCvv();
    this.focusedElement = FocusedElement.CVV;
  }

  onBlur(): void {
    this.focusedElement = null;
  }

  onCardNumberBlur(): void {
    this.maskCardNumber();
    this.onBlur();
  }

  onCvvBlur(): void {
    this.maskCvv();
    this.onBlur();
  }

  onCardNameKeyPress($event): boolean {
    return (($event.charCode >= 65 && $event.charCode <= 90) ||
      ($event.charCode >= 97 && $event.charCode <= 122) || ($event.charCode === 32));
  }

  onYearChange(): void {
    if (this.cardModel.expirationYear === this.minCardYear.toString()) {
      this.cardModel.expirationMonth = '';
    }
  }

  onSubmitClick() {
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
    const arr = this.displayedCardNumber.split('');
    arr.forEach((element, index) => {
      if (this.cardNumberMask[index] === '*') {
        arr[index] = '*';
      }
    });
    this.displayedCardNumber = arr.join('');
  }

  private unMaskCardNumber(): void {
    this.displayedCardNumber = this.cardModel.cardNumber;
  }

  private unMaskCvv(): void {
    this.displayedCvv = this.cardModel.cvv;
  }

  private maskCvv(): void {
    this.displayedCvv = new Array(this.cardModel.cvv.length + 1).join('*');
  }
}

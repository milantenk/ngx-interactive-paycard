import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CardLabel, FormLabel } from './shared';
import { CardModel } from './shared/card-model';
import { DefaultComponentLabels } from './shared/default-component-labels';
import { FocusedElement } from './shared/focused-element';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'ngx-interactive-paycard',
  templateUrl: 'interactive-paycard.component.html',
  styleUrls: ['./interactive-paycard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardComponent]
})
export class InteractivePaycardComponent implements OnInit {

  readonly chipImgPath = input('');
  readonly logoImgPath = input('');
  readonly backBgImgPath = input('');
  readonly frontBgImgPath = input('');
  readonly cardNumberFormat = input<string>();
  readonly cardNumberMask = input<string>();

  readonly cardLabels = input<CardLabel | null>(null);
  readonly formLabels = input<FormLabel | null>(null);

  readonly resolvedCardLabels = computed<CardLabel>(() => this.cardLabels() ?? {
    expires: DefaultComponentLabels.CARD_EXPIRES,
    cardHolder: DefaultComponentLabels.CARD_HOLDER_NAME,
    fullName: DefaultComponentLabels.CARD_FULL_NAME,
    mm: DefaultComponentLabels.CARD_EXPIRATION_MONTH_FORMAT,
    yy: DefaultComponentLabels.CARD_EXPIRATION_YEAR_FORMAT
  });

  readonly resolvedFormLabels = computed<FormLabel>(() => this.formLabels() ?? {
    cardNumber: DefaultComponentLabels.FORM_CARD_NUMBER,
    cardHolderName: DefaultComponentLabels.FORM_CARD_HOLDER_NAME,
    expirationDate: DefaultComponentLabels.FORM_EXPIRATION_DATE,
    expirationMonth: DefaultComponentLabels.FORM_EXPIRATION_MONTH,
    expirationYear: DefaultComponentLabels.FORM_EXPIRATION_YEAR,
    cvv: DefaultComponentLabels.FORM_CVV,
    submitButton: DefaultComponentLabels.FORM_SUBMIT_BUTTON
  });

  readonly submitEvent = output<CardModel>();
  readonly changeCard = output<CardModel>();
  readonly changeCardNumber = output<string>();

  readonly cardModel = signal<CardModel>({ cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' });
  readonly cardNumberMaxLength = computed(() => this.cardNumberFormat()?.length ?? 19);
  readonly cardNumberFormatArray = computed(() => this.cardNumberFormat()?.split('') ?? []);

  minCardYear = new Date().getFullYear();
  readonly displayedCardNumber = signal('');
  readonly displayedCvv = signal('');
  readonly focusedElement = signal<FocusedElement | null>(null);

  readonly submitted = signal(false);
  readonly submitSuccess = signal(false);

  readonly cardNumberId = 'cardNumberId';
  readonly cardNameId = 'cardNameId';
  readonly yearSelectId = 'yearSelectId';

  // Validation computeds
  readonly cardNumberDigitCount = computed(() =>
    (this.cardNumberFormat() ?? '').split('').filter(c => c === '#').length
  );

  readonly isAmexNumber = computed(() => {
    const num = this.cardModel().cardNumber.replace(/ /g, '');
    return num.length >= 2 && (num.startsWith('34') || num.startsWith('37'));
  });

  readonly formatSupportsAmex = computed(() => this.cardNumberDigitCount() === 15);

  readonly showAmexWarning = computed(() => this.isAmexNumber() && !this.formatSupportsAmex());

  readonly isCardNumberValid = computed(() => {
    const num = this.cardModel().cardNumber.replace(/ /g, '');
    return num.length === this.cardNumberDigitCount() && this.luhnCheck(num);
  });

  readonly isCardNameValid = computed(() => this.cardModel().cardName.trim().length >= 2);

  readonly isMonthValid = computed(() => !!this.cardModel().expirationMonth);

  readonly isYearValid = computed(() => !!this.cardModel().expirationYear);

  readonly isCvvValid = computed(() => this.cardModel().cvv.length >= 3);

  readonly isFormValid = computed(() =>
    this.isCardNumberValid() && this.isCardNameValid() &&
    this.isMonthValid() && this.isYearValid() && this.isCvvValid()
  );

  ngOnInit() {
    const format = this.cardNumberFormat();
    if (!format || new RegExp('[^# ]').test(format)) {
      throw new Error('The card number format must contain only "#" and " " characters! Check the "cardNumberFormat" input parameter!');
    }
    const mask = this.cardNumberMask();
    if (!mask || new RegExp('[^# *]').test(mask)) {
      throw new Error('The card number mask must contain only "#", "*" and " " characters! Check the "cardNumberMask" input parameter!');
    }
    if (mask.length !== format.length) {
      throw new Error('The card number mask and the card number format must have the same length! \
      Check the "cardNumberFormat" and the "cardNumberMask" input parameters!');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCardNumberChange($event: any): void {
    const inputEl = $event.target;
    let cursorPosStart = inputEl.selectionStart;
    let cursorPosEnd = inputEl.selectionEnd;
    let processedCardNumber: string = $event.target.value;
    const newValues: string[] = [];
    const letterRegex = new RegExp('[^0-9]');
    const isCursorAtTheEnd = cursorPosEnd === processedCardNumber.length;
    const cardNumWithoutSpaceAsArray = processedCardNumber.replace(/ /g, '').split('');
    this.cardNumberFormatArray().forEach((format) => {
      if (cardNumWithoutSpaceAsArray.length > 0) {
        if (format === '#') {
          let isNumber: boolean;
          let character: string;
          do {
            character = cardNumWithoutSpaceAsArray.shift();
            isNumber = !(letterRegex.test(character));
            if (isNumber) {
              newValues.push(character);
            } else {
              cursorPosEnd--;
              cursorPosStart--;
            }
          } while (!isNumber && character !== undefined);
        } else if (format === ' ') {
          newValues.push(' ');
        }
      }
    });
    processedCardNumber = newValues.join('').trim();
    this.displayedCardNumber.set(processedCardNumber);
    this.cardModel.update(m => ({ ...m, cardNumber: processedCardNumber }));
    $event.target.value = processedCardNumber;
    if (!isCursorAtTheEnd) {
      inputEl.selectionEnd = cursorPosEnd;
      inputEl.selectionStart = cursorPosStart;
    }
    this.onChangeCard();
    this.onChangeCardNumber();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCvvChange(event: any): void {
    const cvv = event.target.value.replace(/[^0-9]*/g, '');
    this.cardModel.update(m => ({ ...m, cvv }));
    this.displayedCvv.set(cvv);
    event.target.value = cvv;
    this.onChangeCard();
  }

  onCardNumberFocus(): void {
    this.unMaskCardNumber();
    this.focusedElement.set(FocusedElement.CardNumber);
  }

  onCardNameFocus(): void {
    this.focusedElement.set(FocusedElement.CardName);
  }

  onDateFocus(): void {
    this.focusedElement.set(FocusedElement.ExpirationDate);
  }

  onCvvFocus(): void {
    this.unMaskCvv();
    this.focusedElement.set(FocusedElement.CVV);
  }

  onBlur(): void {
    this.focusedElement.set(null);
  }

  onCardNumberBlur(): void {
    this.maskCardNumber();
    this.onBlur();
  }

  onCvvBlur(): void {
    this.maskCvv();
    this.onBlur();
  }

  onCardNameChange(name: string): void {
    // Only allow letters (including accented), spaces, hyphens, and apostrophes
    const filtered = name.replace(/[^a-zA-Z\u00C0-\u024F ' -]/g, '');
    this.cardModel.update(m => ({ ...m, cardName: filtered }));
    this.onChangeCard();
  }

  onMonthChange(): void {
    this.onChangeCard();
  }

  onExpirationMonthChange(month: string): void {
    this.cardModel.update(m => ({ ...m, expirationMonth: month }));
    this.onMonthChange();
  }

  onYearChange(): void {
    this.onChangeCard();
    if (this.cardModel().expirationYear === this.minCardYear.toString()) {
      this.cardModel.update(m => ({ ...m, expirationMonth: '' }));
    }
  }

  onExpirationYearChange(year: string): void {
    this.cardModel.update(m => ({ ...m, expirationYear: year }));
    this.onYearChange();
  }

  onSubmitClick(): void {
    this.submitted.set(true);
    if (!this.isFormValid()) {
      return;
    }
    this.submitEvent.emit(this.cardModel());
    this.resetForm();
    this.submitSuccess.set(true);
    setTimeout(() => this.submitSuccess.set(false), 3000);
  }

  onChangeCard() {
    this.changeCard.emit(this.cardModel());
  }

  onChangeCardNumber() {
    this.changeCardNumber.emit(this.cardModel().cardNumber);
  }

  minCardMonth(): number {
    if (this.cardModel().expirationYear === this.minCardYear.toString()) {
      return new Date().getMonth() + 1;
    } else {
      return 1;
    }
  }

  generateMonthValue(index: number): string {
    return index < 10 ? `0${index}` : index.toString();
  }

  private resetForm(): void {
    this.cardModel.set({ cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' });
    this.displayedCardNumber.set('');
    this.displayedCvv.set('');
    this.submitted.set(false);
  }

  private luhnCheck(num: string): boolean {
    let sum = 0;
    let isEven = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }

  private maskCardNumber(): void {
    const displayed = this.displayedCardNumber();
    const mask = this.cardNumberMask();
    this.cardModel.update(m => ({ ...m, cardNumber: displayed }));
    const arr = displayed.split('');
    arr.forEach((element, index) => {
      if (mask?.[index] === '*') {
        arr[index] = '*';
      }
    });
    this.displayedCardNumber.set(arr.join(''));
  }

  private unMaskCardNumber(): void {
    this.displayedCardNumber.set(this.cardModel().cardNumber);
  }

  private unMaskCvv(): void {
    this.displayedCvv.set(this.cardModel().cvv);
  }

  private maskCvv(): void {
    this.displayedCvv.set(new Array(this.cardModel().cvv.length + 1).join('*'));
  }
}

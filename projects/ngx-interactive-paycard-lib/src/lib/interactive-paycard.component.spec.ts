import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CardLabel, FormLabel } from './shared';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { InteractivePaycardComponent } from './interactive-paycard.component';
import { DefaultComponentLabels } from './shared/default-component-labels';
import { FocusedElement } from './shared/focused-element';

describe('InteractivePaycardComponent', () => {

  const formLabelsByDefaultMock: FormLabel = {
    cardNumber: DefaultComponentLabels.FORM_CARD_NUMBER,
    cardHolderName: DefaultComponentLabels.FORM_CARD_HOLDER_NAME,
    expirationDate: DefaultComponentLabels.FORM_EXPIRATION_DATE,
    expirationMonth: DefaultComponentLabels.FORM_EXPIRATION_MONTH,
    expirationYear: DefaultComponentLabels.FORM_EXPIRATION_YEAR,
    cvv: DefaultComponentLabels.FORM_CVV,
    submitButton: DefaultComponentLabels.FORM_SUBMIT_BUTTON
  };
  const cardLabelsByDefaultMock: CardLabel = {
    expires: DefaultComponentLabels.CARD_EXPIRES,
    cardHolder: DefaultComponentLabels.CARD_HOLDER_NAME,
    fullName: DefaultComponentLabels.CARD_FULL_NAME,
    mm: DefaultComponentLabels.CARD_EXPIRATION_MONTH_FORMAT,
    yy: DefaultComponentLabels.CARD_EXPIRATION_YEAR_FORMAT
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractivePaycardComponent],
      providers: [provideNoopAnimations(), provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('cardNumberFormat', '#### #### #### ####');
    fixture.componentRef.setInput('cardNumberMask', '#### **** **** ####');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should throw error if there is no card number format', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    expect(() => { errFixture.detectChanges(); }).toThrow();
  });

  it('should throw error if there is no card number mask', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    errFixture.componentRef.setInput('cardNumberFormat', '#### #### #### ####');
    expect(() => { errFixture.detectChanges(); }).toThrow();
  });

  it('should throw error if the mask format and card number format does not match', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    errFixture.componentRef.setInput('cardNumberFormat', '#### #### #### ####');
    errFixture.componentRef.setInput('cardNumberMask', '#### **** **** ###');
    expect(() => { errFixture.detectChanges(); }).toThrow();
  });

  it('should show default values for form component labels', () => {
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    expect(component.resolvedFormLabels()).toEqual(formLabelsByDefaultMock);
  });

  it('should show default values for card component labels', () => {
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    expect(component.resolvedCardLabels()).toEqual(cardLabelsByDefaultMock);
  });

  it('should emit an event when submit button is clicked with a valid form', () => {
    // Arrange
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    fixture.componentRef.setInput('cardNumberFormat', '#### #### #### ####');
    fixture.componentRef.setInput('cardNumberMask', '#### **** **** ####');
    fixture.detectChanges();
    const component = fixture.componentInstance;
    vi.spyOn(component.submitEvent, 'emit');
    component.cardModel.set({
      cardNumber: '4539 1488 0343 6467',
      cardName: 'John Doe',
      expirationMonth: '12',
      expirationYear: new Date().getFullYear().toString(),
      cvv: '123'
    });

    // Act
    component.onSubmitClick();

    // Assert
    expect(component.submitEvent.emit).toHaveBeenCalled();
  });

  it('should not emit an event when submit button is clicked with an invalid form', () => {
    // Arrange
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    vi.spyOn(component.submitEvent, 'emit');

    // Act
    component.onSubmitClick();

    // Assert
    expect(component.submitEvent.emit).not.toHaveBeenCalled();
  });

  describe('minCardMonth', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should provide a valid month when card is expirong this year', () => {
      component.cardModel.update(m => ({ ...m, expirationYear: '2000' }));
      component.minCardYear = 2000;

      const thisMonth = new Date().getMonth();
      expect(component.minCardMonth()).toEqual(thisMonth + 1);
    });

    it('should return Jan as the default', () => {
      component.cardModel.update(m => ({ ...m, expirationYear: '2000' }));
      component.minCardYear = 2001;

      expect(component.minCardMonth()).toEqual(1);
    });
  });

  describe('generateMonthValue', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should prefix single digits with a zero', () => {
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
        expect(component.generateMonthValue(i)).toEqual(`0${i}`);
      });
    });

    it('should convert double-digit numbers to strings', () => {
      [10, 11, 12].forEach(i => {
        expect(component.generateMonthValue(i)).toEqual(`${i}`);
      });
    });
  });

  describe('onYearChange', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should reset the expiration month when the expiration year equals the minCardYear', () => {
      component.cardModel.update(m => ({ ...m, expirationYear: '2000', expirationMonth: '04' }));
      component.minCardYear = 2000;

      component.onYearChange();
      expect(component.cardModel().expirationMonth).toEqual('');
    });

    it('should not reset the expiration month when the expiration year is not equal to the minCardYear', () => {
      component.cardModel.update(m => ({ ...m, expirationYear: '2000', expirationMonth: '04' }));
      component.minCardYear = 2001;

      component.onYearChange();
      expect(component.cardModel().expirationMonth).toEqual('04');
    });
  });

  describe('onCvvFocus', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should set the displayed CVV to what is stored in the model', () => {
      component.cardModel.update(m => ({ ...m, cvv: '123' }));
      expect(component.displayedCvv()).toEqual('');

      component.onCvvFocus();
      expect(component.displayedCvv()).toEqual(component.cardModel().cvv);
    });

    it('should force focus to the CVV field', () => {
      expect(component.focusedElement()).toBeNull();

      component.onCvvFocus();
      expect(component.focusedElement()).toEqual(FocusedElement.CVV);
    });
  });

  describe('onCvvBlur', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should replace the displayed CVV value with a masked string of same length', () => {
      component.displayedCvv.set('123');
      component.cardModel.update(m => ({ ...m, cvv: '123' }));

      component.onCvvBlur();
      expect(component.displayedCvv()).toEqual('***');

      component.displayedCvv.set('12345');
      component.cardModel.update(m => ({ ...m, cvv: '12345' }));

      component.onCvvBlur();
      expect(component.displayedCvv()).toEqual('*****');
    });

    it('should clear focus', () => {
      component.focusedElement.set(FocusedElement.CVV);

      component.onCvvBlur();
      expect(component.focusedElement()).toBeNull();
    });
  });

  describe('onCardNumberFocus', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should set the displayed card number to what is stored in the model', () => {
      component.cardModel.update(m => ({ ...m, cardNumber: '1234123412341234' }));
      expect(component.displayedCardNumber()).toEqual('');

      component.onCardNumberFocus();
      expect(component.displayedCardNumber()).toEqual(component.cardModel().cardNumber);
    });

    it('should force focus to the Card Number field', () => {
      expect(component.focusedElement()).toBeNull();

      component.onCardNumberFocus();
      expect(component.focusedElement()).toEqual(FocusedElement.CardNumber);
    });
  });

  describe('onCardNumberBlur', () => {
    let fixture: ComponentFixture<InteractivePaycardComponent>;
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should set the card number in the model equal to the display value', () => {
      const value = '1234123412341234';
      component.displayedCardNumber.set(value);
      fixture.componentRef.setInput('cardNumberMask', '************####');
      component.cardModel.update(m => ({ ...m, cardNumber: '' }));

      component.onCardNumberBlur();
      expect(component.cardModel().cardNumber).toEqual(value);
    });

    it('should replace the displayed CardNumber value with a masked string following the card mask', () => {
      component.displayedCardNumber.set('1234123412349876');
      fixture.componentRef.setInput('cardNumberMask', '************####');

      component.onCardNumberBlur();
      expect(component.displayedCardNumber()).toEqual('************9876');
    });

    it('should clear focus', () => {
      component.focusedElement.set(FocusedElement.CardNumber);

      component.onCardNumberBlur();
      expect(component.focusedElement()).toBeNull();
    });
  });

  describe('onCardNumberChange', () => {
    let fixture: ComponentFixture<InteractivePaycardComponent>;
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(InteractivePaycardComponent);
      fixture.componentRef.setInput('cardNumberFormat', '#### #### #### ####');
      component = fixture.componentInstance;
    });

    it('should do nothing if the card number is empty', () => {
      const event = {
        target: {
          selectionStart: 0,
          selectionEnd: 0,
          value: ''
        }
      };

      component.onCardNumberFocus();
      component.onCardNumberChange(event);

      expect(component.displayedCardNumber()).toEqual(event.target.value);
      expect(component.cardModel().cardNumber).toEqual(event.target.value);
      expect(event.target.selectionStart).toBe(0);
      expect(event.target.selectionEnd).toBe(0);
    });

    it('should do nothing with inputs that match the mask', () => {
      const event = {
        target: {
          selectionStart: 2,
          selectionEnd: 4,
          value: '1234 2345 3456 7890'
        }
      };

      component.onCardNumberFocus();
      component.onCardNumberChange(event);

      expect(component.displayedCardNumber()).toEqual(event.target.value);
      expect(component.cardModel().cardNumber).toEqual(event.target.value);
      expect(event.target.selectionStart).toBe(2);
      expect(event.target.selectionEnd).toBe(4);
    });

    it('should remove a non-numerical character with inputs that match the mask', () => {
      const value = 'A1234 2345 3456 7890';
      const event = {
        target: {
          selectionStart: 2,
          selectionEnd: 4,
          value: `${value}`
        }
      };

      component.onCardNumberFocus();
      component.onCardNumberChange(event);

      expect(component.displayedCardNumber()).toEqual(value.slice(1));
      expect(component.cardModel().cardNumber).toEqual(value.slice(1));
      expect(event.target.value).toEqual(value.slice(1));
      expect(event.target.selectionStart).toBe(1);
      expect(event.target.selectionEnd).toBe(3);
    });
  });

  describe('onCardNameFocus', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should force focus to the Card Name field', () => {
      expect(component.focusedElement()).toBeNull();
      component.onCardNameFocus();
      expect(component.focusedElement()).toEqual(FocusedElement.CardName);
    });
  });

  describe('onCardNameChange', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should allow letters', () => {
      component.onCardNameChange('John');
      expect(component.cardModel().cardName).toBe('John');
    });
    it('should allow spaces', () => {
      component.onCardNameChange('John Doe');
      expect(component.cardModel().cardName).toBe('John Doe');
    });
    it('should allow hyphens', () => {
      component.onCardNameChange('Mary-Jane');
      expect(component.cardModel().cardName).toBe('Mary-Jane');
    });
    it('should allow apostrophes', () => {
      component.onCardNameChange("O'Brien");
      expect(component.cardModel().cardName).toBe("O'Brien");
    });
    it('should strip digits and special characters', () => {
      component.onCardNameChange('John123 @#$');
      expect(component.cardModel().cardName).toBe('John ');
    });
  });

  describe('onDateFocus', () => {
    let component: InteractivePaycardComponent;

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent);
      component = fixture.componentInstance;
    });

    it('should force focus to the Date field', () => {
      expect(component.focusedElement()).toBeNull();
      component.onDateFocus();
      expect(component.focusedElement()).toEqual(FocusedElement.ExpirationDate);
    });
  });
});

import { async, TestBed } from '@angular/core/testing';
import { CardLabel, FormLabel } from './shared';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './card/card.component';
import { InteractivePaycardComponent } from './interactive-paycard.component';
import { DefaultComponentLabels } from './shared/default-component-labels';
import { FocusedElement } from './shared/focused-element';
import { IfEveryChangesDirective } from './shared/if-every-changes.directive';
import { IfUndefinedChangesDirective } from './shared/if-undefined-changes.directive';

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
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InteractivePaycardComponent, CardComponent, IfUndefinedChangesDirective, IfEveryChangesDirective],
      imports: [
        FormsModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    component.cardNumberFormat = '#### #### #### ####';
    component.cardNumberMask = '#### **** **** ####';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should throw error if there is no card number format', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    expect(() => { errFixture.detectChanges() }).toThrow();
  });

  it('should throw error if there is no card number mask', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    errFixture.componentInstance.cardNumberFormat = '#### #### #### ####';
    expect(() => { errFixture.detectChanges() }).toThrow();
  });

  it('should throw error if the mask format and card number format does not match', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    errFixture.componentInstance.cardNumberFormat = '#### #### #### ####';
    errFixture.componentInstance.cardNumberMask = '#### **** **** ###';
    expect(() => { errFixture.detectChanges() }).toThrow();
  });

  it('should show default values for form component labels', () => {
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    expect(component.formLabels).toEqual(formLabelsByDefaultMock);
  });

  it('should show default values for card component labels', () => {
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    expect(component.cardLabels).toEqual(cardLabelsByDefaultMock);
  });

  it('should emit an event when submit button is clicked', () => {
    // Arrange
    const fixture = TestBed.createComponent(InteractivePaycardComponent);
    const component = fixture.componentInstance;
    spyOn(component.submitEvent, 'emit');

    // Act
    component.onSubmitClick();

    // Assert
    expect(component.submitEvent.emit).toHaveBeenCalled();
  });

  describe('minCardMonth', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should provide a valid month when card is expirong this year', () => {
      component.cardModel.expirationYear = '2000';
      component.minCardYear = 2000;

      const thisMonth = new Date().getMonth()
      expect(component.minCardMonth()).toEqual(thisMonth + 1)
    })

    it('should return Jan as the default', () => {
      component.cardModel.expirationYear = '2000';
      component.minCardYear = 2001;

      expect(component.minCardMonth()).toEqual(1)
    })
  })

  describe('generateMonthValue', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should prefix single digits with a zero', () => {
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
        expect(component.generateMonthValue(i)).toEqual(`0${i}`)
      })
    })

    it('should convert double-digit numbers to strings', () => {
      [10, 11, 12].forEach(i => {
        expect(component.generateMonthValue(i)).toEqual(`${i}`)
      })
    })
  })

  describe('onYearChange', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should reset the expiration month when the expiration year equals the minCardYear', () => {
      component.cardModel.expirationYear = '2000';
      component.minCardYear = 2000;
      component.cardModel.expirationMonth = '04';

      component.onYearChange()
      expect(component.cardModel.expirationMonth).toEqual('')
    })

    it('should not reset the expiration month when the expiration year is not equal to the minCardYear', () => {
      component.cardModel.expirationYear = '2000';
      component.minCardYear = 2001;
      component.cardModel.expirationMonth = '04';

      component.onYearChange()
      expect(component.cardModel.expirationMonth).toEqual('04')
    })
  })

  describe('onCvvFocus', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should set the displayed CVV to what is stored in the model', () => {
      component.cardModel.cvv = '123'
      expect(component.displayedCvv).toEqual('')

      component.onCvvFocus()
      expect(component.displayedCvv).toEqual(component.cardModel.cvv)
    })

    it('should force focus to the CVV field', () => {
      expect(component.focusedElement).toBeUndefined()

      component.onCvvFocus()
      expect(component.focusedElement).toEqual(FocusedElement.CVV)
    })
  })

  describe('onCvvBlur', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should replace the displayed CVV value with a masked string of same length', () => {
      component.displayedCvv = '123'
      component.cardModel.cvv = '123'

      component.onCvvBlur()
      expect(component.displayedCvv).toEqual('***')

      component.displayedCvv = '12345'
      component.cardModel.cvv = '12345'

      component.onCvvBlur()
      expect(component.displayedCvv).toEqual('*****')
    })

    it('should clear focus', () => {
      component.focusedElement = FocusedElement.CVV

      component.onCvvBlur()
      expect(component.focusedElement).toBeNull()
    })
  })

  describe('onCardNumberFocus', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should set the displayed card number to what is stored in the model', () => {
      component.cardModel.cardNumber = '1234123412341234'
      expect(component.displayedCardNumber).toEqual('')

      component.onCardNumberFocus()
      expect(component.displayedCardNumber).toEqual(component.cardModel.cardNumber)
    })

    it('should force focus to the Card Number field', () => {
      expect(component.focusedElement).toBeUndefined()

      component.onCardNumberFocus()
      expect(component.focusedElement).toEqual(FocusedElement.CardNumber)
    })
  })

  describe('onCardNumberBlur', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should set the card number in the model equal to the display value', () => {
      const value = '1234123412341234'
      component.displayedCardNumber = value
      component.cardNumberMask = '************####'
      component.cardModel.cardNumber = ''

      component.onCardNumberBlur()
      expect(component.cardModel.cardNumber).toEqual(value)
    })

    it('should replace the displayed CardNumber value with a masked string following the card mask', () => {
      component.displayedCardNumber = '1234123412349876'
      component.cardNumberMask = '************####'

      component.onCardNumberBlur()
      expect(component.displayedCardNumber).toEqual('************9876')
    })

    it('should clear focus', () => {
      component.focusedElement = FocusedElement.CardNumber

      component.onCardNumberBlur()
      expect(component.focusedElement).toBeNull()
    })
  })

  describe('onCardNumberChange', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
      component.cardNumberFormatArray = ['#', '#', '#', '#', ' ', '#', '#', '#', '#', ' ', '#', '#', '#', '#', ' ', '#', '#', '#', '#']
    })

    it('should do nothing if the card number is empty', () => {
      const event = {
        srcElement: {
          selectionStart: 0,
          selectionEnd: 0,
        },
        target: {
          value: ''
        }
      }

      component.onCardNumberFocus()
      component.onCardNumberChange(event)

      expect(component.displayedCardNumber).toEqual(event.target.value)
      expect(component.cardModel.cardNumber).toEqual(event.target.value)
      expect(event.srcElement.selectionStart).toBe(0)
      expect(event.srcElement.selectionEnd).toBe(0)
    })

    it('should do nothing with inputs that match the mask', () => {
      const event = {
        srcElement: {
          selectionStart: 2,
          selectionEnd: 4,
        },
        target: {
          value: '1234 2345 3456 7890'
        }
      }

      component.onCardNumberFocus()
      component.onCardNumberChange(event)

      expect(component.displayedCardNumber).toEqual(event.target.value)
      expect(component.cardModel.cardNumber).toEqual(event.target.value)
      expect(event.srcElement.selectionStart).toBe(2)
      expect(event.srcElement.selectionEnd).toBe(4)
    })

    it('should remove a non-numerical character with inputs that match the mask', () => {
      const value = 'A1234 2345 3456 7890'
      const event = {
        srcElement: {
          selectionStart: 2,
          selectionEnd: 4,
        },
        target: {
          value: `${value}` // convert to new string so it can be overwritten
        }
      }

      component.onCardNumberFocus()
      component.onCardNumberChange(event)

      expect(component.displayedCardNumber).toEqual(value.slice(1))
      expect(component.cardModel.cardNumber).toEqual(value.slice(1))
      expect(event.target.value).toEqual(value.slice(1))
      expect(event.srcElement.selectionStart).toBe(1)
      expect(event.srcElement.selectionEnd).toBe(3)
    })
  })

  describe('onCardNameFocus', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should force focus to the Card Name field', () => {
      expect(component.focusedElement).toBeUndefined()
      component.onCardNameFocus()
      expect(component.focusedElement).toEqual(FocusedElement.CardName)
    })
  })

  describe('onCardNameKeyPress', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should exclude ASCII characters 64 and below, but allow 32', () => {
      for (let i = 0; i < 65; i++) {
        expect(component.onCardNameKeyPress({ charCode: i })).toBe(i === 32)
      }
    })
    it('should allow ASCII characters 65 thru 90', () => {
      for (let i = 65; i < 91; i++) {
        expect(component.onCardNameKeyPress({ charCode: i })).toBeTrue()
      }
    })
    it('should exclude ASCII characters 91 thru 96', () => {
      for (let i = 91; i < 96; i++) {
        expect(component.onCardNameKeyPress({ charCode: i })).toBeFalse()
      }
    })
    it('should allow ASCII characters 97 thru 122', () => {
      for (let i = 97; i < 123; i++) {
        expect(component.onCardNameKeyPress({ charCode: i })).toBeTrue()
      }
    })
    it('should exclude ASCII characters above 122', () => {
      for (let i = 123; i < 128; i++) {
        expect(component.onCardNameKeyPress({ charCode: i })).toBeFalse()
      }
    })
  })

  describe('onDateFocus', () => {
    let component: InteractivePaycardComponent

    beforeEach(() => {
      const fixture = TestBed.createComponent(InteractivePaycardComponent)
      component = fixture.componentInstance
    })

    it('should force focus to the Date field', () => {
      expect(component.focusedElement).toBeUndefined()
      component.onDateFocus()
      expect(component.focusedElement).toEqual(FocusedElement.ExpirationDate)
    })
  })
});

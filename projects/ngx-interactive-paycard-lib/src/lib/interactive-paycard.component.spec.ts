import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InteractivePaycardComponent } from './interactive-paycard.component';
import { CardComponent } from './card/card.component';
import { IfUndefinedChangesDirective } from './shared/if-undefined-changes.directive';
import { IfEveryChangesDirective } from './shared/if-every-changes.directive';
import { FormLabel, CardLabel } from './shared';
import { DefaultComponentLabels } from './shared/default-component-labels';

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
});

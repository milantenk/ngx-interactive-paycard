import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InteractivePaycardComponent } from './interactive-paycard.component';
import { CardComponent } from './card/card.component';
import { IfUndefinedChangesDirective } from './shared/if-undefined-changes.directive';
import { IfEveryChangesDirective } from './shared/if-every-changes.directive';

describe('InteractivePaycardComponent', () => {

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
    expect(()=>{errFixture.detectChanges()}).toThrow();
  });

  it('should throw error if the mask format and card number format does not match', () => {
    const errFixture = TestBed.createComponent(InteractivePaycardComponent);
    errFixture.componentInstance.cardNumberFormat = '#### #### #### ####';
    errFixture.componentInstance.cardNumberMask = '#### **** **** ###';
    expect(()=>{errFixture.detectChanges()}).toThrow();
  });
});

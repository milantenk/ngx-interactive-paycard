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
  let component: InteractivePaycardComponent;
  let fixture: ComponentFixture<InteractivePaycardComponent>;

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

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractivePaycardComponent);
    component = fixture.componentInstance;
    component.cardNumberFormat = '#### #### #### ####';
    component.cardNumberMask = '#### **** **** ####';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

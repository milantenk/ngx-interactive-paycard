import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractivePaycardComponent } from './interactive-paycard.component';
import { CardComponent } from './card/card.component';
import { IfChangesDirective } from './shared/if-changes.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InteractivePaycardComponent', () => {
  let component: InteractivePaycardComponent;
  let fixture: ComponentFixture<InteractivePaycardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractivePaycardComponent, CardComponent, IfChangesDirective ],
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
    component.cardNumberFormat = "#### #### #### ####";
    component.cardNumberMask = "#### **** **** ####";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

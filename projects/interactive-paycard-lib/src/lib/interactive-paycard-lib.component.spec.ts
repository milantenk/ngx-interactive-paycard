import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractivePaycardLibComponent } from './interactive-paycard-lib.component';

describe('InteractivePaycardLibComponent', () => {
  let component: InteractivePaycardLibComponent;
  let fixture: ComponentFixture<InteractivePaycardLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractivePaycardLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractivePaycardLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

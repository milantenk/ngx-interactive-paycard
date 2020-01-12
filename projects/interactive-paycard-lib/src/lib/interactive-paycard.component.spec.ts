import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractivePaycardComponent } from './interactive-paycard.component';

describe('InteractivePaycardComponent', () => {
  let component: InteractivePaycardComponent;
  let fixture: ComponentFixture<InteractivePaycardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractivePaycardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractivePaycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

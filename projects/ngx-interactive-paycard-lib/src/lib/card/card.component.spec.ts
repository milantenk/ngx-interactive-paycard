import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { FocusedElement } from '../shared/focused-element';
import { CardComponent } from './card.component';
import { CardModel } from '../shared/card-model';

const mockCardModel: CardModel = { cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' };
const mockCardLabels = { cardHolder: '', expires: '', fullName: '', mm: '', yy: '' };

describe('CardComponent', () => {
    let fixture: ComponentFixture<CardComponent>;
    let component: any;

    const offsetWidth = 'offsetWidth';
    const offsetHeight = 'offsetHeight';
    const offsetLeft = 'offsetWidth';
    const offsetTop = 'offsetTop';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardComponent);
        fixture.componentRef.setInput('cardModel', mockCardModel);
        fixture.componentRef.setInput('cardNumberFormat', '#### #### #### ####');
        fixture.componentRef.setInput('displayedCardNumber', '');
        fixture.componentRef.setInput('chipImgPath', '');
        fixture.componentRef.setInput('logoImgPath', '');
        fixture.componentRef.setInput('backBgImgPath', '');
        fixture.componentRef.setInput('frontBgImgPath', '');
        fixture.componentRef.setInput('cardLabels', mockCardLabels);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        component.currentlyFocusedNativeElement = {
            offsetWidth,
            offsetHeight,
            offsetLeft,
            offsetTop
        };
    });

    describe('#onOrientationChange', () => {
        const delay = 50;
        beforeEach(() => {
            component.setFocusStyle = vi.fn();
        });

        it('should do nothing if has no focus native element', (done: any) => {
            component.currentlyFocusedNativeElement = null;
            component.onOrientationChange();
            setTimeout(() => {
                expect(component.setFocusStyle).not.toHaveBeenCalled();
                done();
            }, delay);
        });

        it('should set focus styles after delay if native element exists', (done: any) => {
            component.onOrientationChange();
            expect(component.setFocusStyle).not.toHaveBeenCalled();
            setTimeout(() => {
                expect(component.setFocusStyle).toHaveBeenCalled();
                done();
            }, delay);
        });
    });

    describe('#setFocusStyle', () => {
        it('should set focus style from current focused native element', () => {
            component.setFocusStyle();
            expect(component.focusStyle()).toEqual({
                width: `${offsetWidth}px`,
                height: `${offsetHeight}px`,
                transition: 'none',
                transform: expect.any(String)
            });
            expect(component.focusStyle().transform).toContain(`translateX(${offsetLeft}px)`);
            expect(component.focusStyle().transform).toContain(`translateY(${offsetTop}px)`);
        });
    });

    describe('#focusedElement effect', () => {
        const cardNumberViewChildNativeElement = 'cardNumberViewChildNativeElement';
        const cardNameViewChildNativeElement = 'cardNameViewChildNativeElement';
        const expireDateViewChildNativeElement = 'expireDateViewChildNativeElement';

        beforeEach(() => {
            component.cardNumberViewChild = { nativeElement: cardNumberViewChildNativeElement };
            component.cardNameViewChild = { nativeElement: cardNameViewChildNativeElement };
            component.expireDateViewChild = { nativeElement: expireDateViewChildNativeElement };
        });

        it('should set native element based on current focused element', () => {
            fixture.componentRef.setInput('focusedElement', FocusedElement.CardNumber);
            TestBed.flushEffects();
            expect(component.currentlyFocusedNativeElement).toBe(cardNumberViewChildNativeElement);

            fixture.componentRef.setInput('focusedElement', FocusedElement.CardName);
            TestBed.flushEffects();
            expect(component.currentlyFocusedNativeElement).toBe(cardNameViewChildNativeElement);

            fixture.componentRef.setInput('focusedElement', FocusedElement.ExpirationDate);
            TestBed.flushEffects();
            expect(component.currentlyFocusedNativeElement).toBe(expireDateViewChildNativeElement);
        });

        it('should set focus style based on current focused native element if it is defined', () => {
            component.cardNumberViewChild = { nativeElement: component.currentlyFocusedNativeElement };
            fixture.componentRef.setInput('focusedElement', FocusedElement.CardNumber);
            TestBed.flushEffects();
            expect(component.focusStyle()).toEqual({
                width: `${offsetWidth}px`,
                height: `${offsetHeight}px`,
                transform: expect.any(String)
            });
            expect(component.focusStyle().transform).toContain(`translateX(${offsetLeft}px)`);
            expect(component.focusStyle().transform).toContain(`translateY(${offsetTop}px)`);
        });
    });
});

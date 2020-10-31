import { FocusedElement } from '../shared/focused-element';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
    let component: any;

    const offsetWidth = 'offsetWidth';
    const offsetHeight = 'offsetHeight';
    const offsetLeft = 'offsetWidth';
    const offsetTop = 'offsetTop';

    beforeEach(() => {
        component = new CardComponent();
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
            component.setFocusStyle = jasmine.createSpy('setFocusStyle');
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
        it('should  set focus style from current focused native element', () => {
            component.setFocusStyle();
            expect(component.focusStyle).toEqual({
                width: `${offsetWidth}px`,
                height: `${offsetHeight}px`,
                transition: 'none',
                transform: jasmine.any(String)
            });
            expect(component.focusStyle.transform).toContain(`translateX(${offsetLeft}px)`);
            expect(component.focusStyle.transform).toContain(`translateY(${offsetTop}px)`);
        });
    });

    describe('#ngOnChanges', () => {
        const cardNumberViewChildNativeElement = 'cardNumberViewChildNativeElement';
        const cardNameViewChildNativeElement = 'cardNameViewChildNativeElement';
        const expireDateViewChildNativeElement = 'expireDateViewChildNativeElement';

        beforeEach(() => {
            component.cardNumberViewChild = { nativeElement: cardNumberViewChildNativeElement };
            component.cardNameViewChild = { nativeElement: cardNameViewChildNativeElement };
            component.expireDateViewChild = { nativeElement: expireDateViewChildNativeElement };
        });

        it('should set native element based on current focused element', () => {
            component.ngOnChanges({focusedElement: {currentValue: FocusedElement.CardNumber}});
            expect(component.currentlyFocusedNativeElement).toBe(cardNumberViewChildNativeElement);

            component.ngOnChanges({focusedElement: {currentValue: FocusedElement.CardName}});
            expect(component.currentlyFocusedNativeElement).toBe(cardNameViewChildNativeElement);

            component.ngOnChanges({focusedElement: {currentValue: FocusedElement.ExpirationDate}});
            expect(component.currentlyFocusedNativeElement).toBe(expireDateViewChildNativeElement);
        });

        it('should set focus style based on current focused native element if it is defined', () => {
            component.cardNumberViewChild = { nativeElement: component.currentlyFocusedNativeElement };
            component.ngOnChanges({focusedElement: {currentValue: FocusedElement.CardNumber}});
            expect(component.focusStyle).toEqual({
                width: `${offsetWidth}px`,
                height: `${offsetHeight}px`,
                transform: jasmine.any(String)
            });
            expect(component.focusStyle.transform).toContain(`translateX(${offsetLeft}px)`);
            expect(component.focusStyle.transform).toContain(`translateY(${offsetTop}px)`);
        });
    });
});
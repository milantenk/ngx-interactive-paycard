import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, HostListener, OnChanges } from '@angular/core';
import { CardModel } from '../shared/card-model';
import { FocusedElement } from '../shared/focused-element';
import { trigger, transition, state, animate, style } from '@angular/animations';

@Component({
    selector: 'card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.scss'],
    animations: [
        trigger('slideFadeUp', [
            state('in', style({ transform: 'translateY(0)' })),
            transition(':enter', [
                style({ transform: 'translateY(15px)', opacity: 0 }),
                animate('0.25s ease-in-out')
            ])
        ]),
        trigger('cardHolderFadeRight', [
            state('in', style({ transform: 'translate(0,0)' })),
            transition(':enter', [
                style({ transform: 'translateX(10px) rotate(45deg)', opacity: 0, position: 'absolute' }),
                animate('0.25s ease-in-out')
            ]),
        ]),
        trigger('cardHolderFadeUp', [
            state('in', style({ transform: 'translate(0,0)' })),
            transition(':enter', [
                style({ transform: 'translateY(15px)', opacity: 0, position: 'absolute' }),
                animate('0.25s ease-in-out')
            ]),
        ])
    ]
})
export class CardComponent implements OnInit, OnChanges {
    constructor() { }

    @Input() cardModel: CardModel;
    @Input() chipImgPath: string;
    @Input() logoImgPath: string;
    @Input() backBgImgPath: string;
    @Input() frontBgImgPath: string;
    @Input() cardNumberFormat: string;
    @Input() displayedCardNumber: string;
    @Input() focusedElement: FocusedElement;

    @ViewChild('cardNumber', { static: false }) cardNumberViewChild: ElementRef;
    @ViewChild('cardName', { static: false }) cardNameViewChild: ElementRef;
    @ViewChild('expireDate', { static: false }) expireDateViewChild: ElementRef;

    currentCardNumberPlaceholder: string[];
    cardHolderNamePlaceholder: string[];
    focusStyle = null;

    FocusedElement = FocusedElement; // This way the enum can be accessed in the template

    currentlyFocusedNativeElement: any;

    @HostListener('window:orientationchange', ['$event'])
    onOrientationChange(event) {
        if (this.currentlyFocusedNativeElement) {
            setTimeout(() => {
                this.focusStyle = {
                    width: `${this.currentlyFocusedNativeElement.offsetWidth}px`,
                    height: `${this.currentlyFocusedNativeElement.offsetHeight}px`,
                    transition: 'none',
                    transform: `translateX(${this.currentlyFocusedNativeElement.offsetLeft}px)
                    translateY(${this.currentlyFocusedNativeElement.offsetTop}px)`
                };
            }, 50); // Workaround: if the orientation changes, the ViewChild won't be updated immediatelly
        }
    }

    ngOnInit() {
        this.currentCardNumberPlaceholder = this.cardNumberFormat.split('');
        this.cardHolderNamePlaceholder = Array(30).fill(''); // CardHolder name is handled the same way as the cardNumber
    }

    getIsNumberMasked(index: number): boolean {
        return this.displayedCardNumber[index] === '*';
    }

    // The selection of the card elements is handled here
    // The card flip based on the CVV is handled in the template directly
    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'focusedElement') {
                if (changes[propName].currentValue != null) {
                    // let focusedNativeElement;
                    if (changes[propName].currentValue === FocusedElement.CardNumber) {
                        this.currentlyFocusedNativeElement = this.cardNumberViewChild.nativeElement;
                    } else if (changes[propName].currentValue === FocusedElement.CardName) {
                        this.currentlyFocusedNativeElement = this.cardNameViewChild.nativeElement;
                    } else if (changes[propName].currentValue === FocusedElement.ExpirationDate) {
                        this.currentlyFocusedNativeElement = this.expireDateViewChild.nativeElement;
                    }
                    if (this.currentlyFocusedNativeElement) {
                        this.focusStyle = {
                            width: `${this.currentlyFocusedNativeElement.offsetWidth}px`,
                            height: `${this.currentlyFocusedNativeElement.offsetHeight}px`,
                            transform: `translateX(${this.currentlyFocusedNativeElement.offsetLeft}px) translateY(${this.currentlyFocusedNativeElement.offsetTop}px)`
                        };
                    }
                } else {
                    this.focusStyle = null;
                }
            }
        }
    }

}

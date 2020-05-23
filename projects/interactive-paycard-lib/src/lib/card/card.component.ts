import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CardModel } from '../shared/card-model';
import { trigger, transition, state, animate, style, AnimationEvent } from '@angular/animations';

@Component({
    selector: 'card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.scss'],
    animations: [
        trigger('expireSlideFadeUp', [
            state('in', style({ transform: 'translateY(0)' })),
            transition(':enter', [
                style({ transform: 'translateY(15px)', opacity: 0 }),
                animate('0.25s ease-in-out')
            ])
        ]),
        trigger('cardNumSlideFadeUp', [
            state('in', style({ transform: 'translate(0,0)' })),
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

export class CardComponent implements OnInit {
    constructor() { }

    @Input() cardModel: CardModel;
    @Input() isCardNumberMasked: boolean;
    @Input() isCardFlipped: boolean;
    @Input() chipImgPath: string;
    @Input() logoImgPath: string;
    @Input() backBgImgPath: string;
    @Input() frontBgImgPath: string;
    @Input() cardNumberFormat: string;
    @Input() displayedCardNumber: string;
    @Input() focusedElement: string;

    @ViewChild('cardNumber', {static: false}) 
    cardNumberViewChild: ElementRef;

    currentCardNumberPlaceholder: string[];
    cardHolderName: string[];

    focusStyle = { width: "50px", height: "40px", transform: "translateX(50px) translateY(50px)" };

    ngOnInit() {
        this.currentCardNumberPlaceholder = this.cardNumberFormat.split('');
    }

    getIsNumberMasked(index: number): boolean {
        return this.displayedCardNumber[index] == '*';
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                if (propName === 'focusedElement') {
                    console.log(changes[propName].currentValue)
                    if(changes[propName].currentValue) {
                        console.log("CardComponent -> ngOnChanges -> this.cardNumberViewChild.nativeElement.offsetHeight", this.cardNumberViewChild.nativeElement.offsetHeight)
                        console.log("CardComponent -> ngOnChanges -> this.cardNumberViewChild.nativeElement.offsetHeight", this.cardNumberViewChild.nativeElement.offsetWidth)
                        console.log("CardComponent -> ngOnChanges -> this.cardNumberViewChild.nativeElement.offsetHeight", this.cardNumberViewChild.nativeElement.offsetLeft)
                        console.log("CardComponent -> ngOnChanges -> this.cardNumberViewChild.nativeElement.offsetHeight", this.cardNumberViewChild.nativeElement.offsetTop)
                        this.focusStyle = { 
                            width: `${this.cardNumberViewChild.nativeElement.offsetWidth}px`, 
                            height: `${this.cardNumberViewChild.nativeElement.offsetHeight}px`, 
                            transform: `translateX(${this.cardNumberViewChild.nativeElement.offsetLeft}px) translateY(${this.cardNumberViewChild.nativeElement.offsetTop}px)` };
                    } else {
                        this.focusStyle = null;
                    }
                }
            }
        }
    }

}
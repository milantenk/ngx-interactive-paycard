import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, input, signal, ViewChild } from '@angular/core';

import { CardLabel } from '../shared';
import { CardModel } from '../shared/card-model';
import { FocusedElement } from '../shared/focused-element';
import { IfEveryChangesDirective } from '../shared/if-every-changes.directive';
import { IfUndefinedChangesDirective } from '../shared/if-undefined-changes.directive';

@Component({
    standalone: true,
    selector: 'card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle, IfEveryChangesDirective, IfUndefinedChangesDirective],
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
export class CardComponent {
    readonly cardModel = input.required<CardModel>();
    readonly chipImgPath = input.required<string>();
    readonly logoImgPath = input.required<string>();
    readonly backBgImgPath = input.required<string>();
    readonly frontBgImgPath = input.required<string>();
    readonly cardNumberFormat = input.required<string>();
    readonly displayedCardNumber = input.required<string>();
    readonly focusedElement = input<FocusedElement | null>(null);
    readonly cardLabels = input.required<CardLabel>();

    @ViewChild('cardNumber', { static: false }) cardNumberViewChild: ElementRef;
    @ViewChild('cardName', { static: false }) cardNameViewChild: ElementRef;
    @ViewChild('expireDate', { static: false }) expireDateViewChild: ElementRef;

    readonly currentCardNumberPlaceholder = computed(() => this.cardNumberFormat().split(''));
    readonly cardHolderNamePlaceholder = Array(30).fill('');
    readonly focusStyle = signal<any>(null);

    FocusedElement = FocusedElement;
    currentlyFocusedNativeElement: any;

    constructor() {
        effect(() => {
            const focused = this.focusedElement();
            if (focused != null) {
                if (focused === FocusedElement.CardNumber) {
                    this.currentlyFocusedNativeElement = this.cardNumberViewChild?.nativeElement;
                } else if (focused === FocusedElement.CardName) {
                    this.currentlyFocusedNativeElement = this.cardNameViewChild?.nativeElement;
                } else if (focused === FocusedElement.ExpirationDate) {
                    this.currentlyFocusedNativeElement = this.expireDateViewChild?.nativeElement;
                }
                if (this.currentlyFocusedNativeElement) {
                    this.focusStyle.set({
                        width: `${this.currentlyFocusedNativeElement.offsetWidth}px`,
                        height: `${this.currentlyFocusedNativeElement.offsetHeight}px`,
                        transform: `translateX(${this.currentlyFocusedNativeElement.offsetLeft}px) translateY(${this.currentlyFocusedNativeElement.offsetTop}px)`
                    });
                }
            } else {
                this.focusStyle.set(null);
            }
        });
    }

    @HostListener('window:orientationchange')
    onOrientationChange() {
        if (this.currentlyFocusedNativeElement) {
            setTimeout(this.setFocusStyle, 50);
        }
    }

    getIsNumberMasked(index: number): boolean {
        return this.displayedCardNumber()[index] === '*';
    }

    private setFocusStyle = () => {
        this.focusStyle.set({
            width: `${this.currentlyFocusedNativeElement.offsetWidth}px`,
            height: `${this.currentlyFocusedNativeElement.offsetHeight}px`,
            transition: 'none',
            transform: `translateX(${this.currentlyFocusedNativeElement.offsetLeft}px)
            translateY(${this.currentlyFocusedNativeElement.offsetTop}px)`
        });
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { CardModel } from '../shared/card-model';

@Component({
    selector: 'card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.scss']
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

    currentCardNumberPlaceholder: string[];
    cardHolderName: string[];

    ngOnInit() {
        this.currentCardNumberPlaceholder = this.cardNumberFormat.split('');
    }

    getIsNumberMasked(index: number): boolean {
        return this.displayedCardNumber[index]=='*';
    }

}
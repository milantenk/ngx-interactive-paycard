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
    @Input() isCardNumberMasked;

    currentPlaceholder: string[];
    amexCardPlaceholder = '#### ###### #####';
    dinersCardPlaceholder = '#### ###### ####';
    defaultCardPlaceholder = '#### #### #### ####';

    ngOnInit() {
        console.log(this.cardModel)
        console.log(this.isCardNumberMasked)
        this.changePlaceholder();
    }

    changePlaceholder() {
        const cardType = this.cardType();
        if (cardType === 'amex') {
            this.currentPlaceholder = this.amexCardPlaceholder.split('')
        } else if (cardType === 'dinersclub') {
            this.currentPlaceholder = this.dinersCardPlaceholder.split('')
        } else {
            this.currentPlaceholder = this.defaultCardPlaceholder.split('')
        }
        /*this.$nextTick(() => {
            this.changeFocus()
        })*/
    }

    cardType() {
        let number = this.cardModel.cardNumber
        let re = new RegExp('^4')
        if (number.match(re) != null) return 'visa'

        re = new RegExp('^(34|37)')
        if (number.match(re) != null) return 'amex'

        re = new RegExp('^5[1-5]')
        if (number.match(re) != null) return 'mastercard'

        re = new RegExp('^6011')
        if (number.match(re) != null) return 'discover'

        re = new RegExp('^62')
        if (number.match(re) != null) return 'unionpay'

        re = new RegExp('^9792')
        if (number.match(re) != null) return 'troy'

        re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}')
        if (number.match(re) != null) return 'dinersclub'

        re = new RegExp('^35(2[89]|[3-8])')
        if (number.match(re) != null) return 'jcb'

        return '' // default type
    }

    getIsNumberMasked(index, n) {
        return index > 4 && index < 14 && this.cardModel.cardNumber.length > index && n.trim() !== '' && this.isCardNumberMasked
    }
}
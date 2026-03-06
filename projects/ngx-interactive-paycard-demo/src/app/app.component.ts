import { Component } from '@angular/core';
import { CardLabel, FormLabel } from 'ngx-interactive-paycard-lib';
import { InteractivePaycardModule } from 'ngx-interactive-paycard-lib';
import { CardModel } from 'ngx-interactive-paycard-lib';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [InteractivePaycardModule]
})
export class AppComponent {
  title = 'ngx-interactive-paycard-demo';
  cardNumberFormat = '#### #### #### ####';
  cardNumberMask = '#### **** **** ####';
  cardLabel: CardLabel = {
    expires: 'Expires',
    cardHolder: 'Card Holder',
    fullName: 'Full Name',
    mm: 'MM',
    yy: 'YY',
  };
  formLabel: FormLabel = {
    cardNumber: 'Card Number',
    cardHolderName: 'Card Holder Name',
    expirationDate: 'Expiration Date',
    expirationMonth: 'Month',
    expirationYear: 'Year',
    cvv: 'CVV',
    submitButton: 'Submit',
  };

  onSubmitEvent($event: CardModel) {
    console.log($event);
  }

  showChangesCard($event: CardModel) {
    // any changes on card (number, name, month, year, cvv)
    console.log($event);
  }

  showChangesCardNumber($event: string) {
    // any changes on card number
    console.log($event);
  }
}

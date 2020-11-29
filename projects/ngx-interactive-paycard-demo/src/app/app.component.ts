import { Component } from '@angular/core';
import { CardLabel, FormLabel } from 'ngx-interactive-paycard-lib';
import { creditCards } from '../assets/credit-card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-interactive-paycard-demo';
  cardNumberFormat = '#### #### #### ####';
  cardNumberMask = '#### **** **** ####';
  // cardLabel change the values of the card labels. ex: Spanish
  cardLabel: CardLabel = {
    expires: 'Expira',
    cardHolder: 'Nombre del Titular',
    fullName: 'Nombre completo',
    mm: 'MM',
    yy: 'AA',
  };
  // cardLabel change the values of the form labels. ex: Spanish
  formLabel: FormLabel = {
    cardNumber: 'Número de Tarjeta',
    cardHolderName: 'Titular de la Tarjeta',
    expirationDate: 'Fecha de Expiracion',
    expirationMonth: 'Mes',
    expirationYear: 'Año',
    cvv: 'CVV',
    submitButton: 'Enviar',
  };
  creditCards = creditCards;
  brand = './assets/logo.png';

  onSubmitEvent($event) {
    console.log($event);
  }

  showChangesCard($event) {
    // any changes on card (number, name, month, year, cvv)
    console.log($event);
  }

  showChangesCardNumber($event) {
    // any changes on card number
    console.log($event);
    this.verifyBrand($event);
  }

  // with this function, you can verify the brand of the card (file: assets/credit-card.ts)
  verifyBrand(cardNumber) {
    const found = this.creditCards.filter( item => item.startsWith.find( el => cardNumber.substring(0, el.length) === el));
    this.brand = './assets/logo.png';
    if (found.length > 0) {
      const foundOne = found[0];
      this.brand = foundOne.logo;
      console.log(foundOne.name);
    }
  }
}

import { Component } from '@angular/core';
import { CardLabel, FormLabel } from 'ngx-interactive-paycard-lib';

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

  onSubmitEvent($event) {
    console.log($event);
  }

  showChanges($event) {
    console.log($event);
  }
}

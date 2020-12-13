# ngx-interactive-paycard

A parameterizable animated credit card built with Angular. 
[See live demo here.](https://ngx-interactive-paycard.netlify.app/)

# Using the library
The library is published in Angular package format. To install the library run in the consumer project following command:

```bash
npm install ngx-interactive-paycard 
```

Import the module of the paycard:

```javascript
import { InteractivePaycardModule } from 'ngx-interactive-paycard';

@NgModule({
  ...
  imports: [
    ...
    InteractivePaycardModule,
    ...
  ],
  ...
})
export class UsedModule { }
```

To embed the card use the `<ngx-interactive-paycard>` selector. 

It has following input parameters:
* `chipImgPath`: The path of the image which should be displayed as chip on the card.
* `logoImagePath`: The path of the company logo image.
* `frontBgImagePath`: The path of the card front background image.
* `backBgImagePath`: The path of the card back background image.
* `cardNumberFormat`: The format of the card number specified with `#` charaters.<br/> For example `"#### #### #### ####"` is a pattern for Master or VISA cards.
* `cardNumberMask`: Specifies which part of the card number should be masked. The masked characters are defined using `*` character the unmasked numbers are defined with `#` character. For example `"#### **** **** ####"` masks the middle of the card number. Note that it should have the same number of characters as the `cardNumberFormat` has.
* `cardLabels`: Optional property to modify all labels in the card component.
* `formLabels`: Optional property to modify all labels in form component.

The output parameters are following:
* `submitEvent`: It is fired if the Submit button is clicked. The event contains all the card data.
* `changeCard`: It is fired if one of the card properties change. The event contains all the card data.
* `changeCardNumber`: It is fired if the card number changes. The event contains the card number.

An example for the usage can be found below. The example assumes, that the consumer `assets` folder contains the necessary images.

```html
<ngx-interactive-paycard 
    [chipImgPath]="'./assets/chip.png'" 
    [logoImgPath]="'./assets/logo.png'"
    [frontBgImgPath]="'./assets/SplitShire1.jpg'" 
    [backBgImgPath]="'./assets/SplitShire3.jpg'"
    [cardNumberFormat]="cardNumberFormat" 
    [cardNumberMask]="cardNumberMask" 
    [cardLabels]="cardLabel"
    [formLabels]="formLabel"
    (submitEvent)="onSubmitEvent($event)"
    (changeCard)="showChangesCard($event)"
    (changeCardNumber)="showChangesCardNumber($event)"
    >
</ngx-interactive-paycard>
```

And the component code for it:

```javascript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-interactive-paycard-demo';
  cardNumberFormat = "#### #### #### ####";
  cardNumberMask = "#### **** **** ####";
 //ex: Optional cardLabels - Spanish
  cardLabel: CardLabel = {
    expires: 'Expira',
    cardHolder: 'Nombre del Titular',
    fullName: 'Nombre completo',
    mm: 'MM',
    yy: 'AA',
  };
  //ex: Optional formLabels - Spanish
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
  
  showChangesCard($event) {
    // any changes on card (number, name, month, year, cvv)
    console.log($event);
  }

    showChangesCardNumber($event) {
    // any changes on card number
    console.log($event);
  }
}
```

A working example can be found in the `ngx-interactive-paycard-demo` folder in the repository of the library.

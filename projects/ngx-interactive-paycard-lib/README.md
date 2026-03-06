# ngx-interactive-paycard

A parameterizable animated credit card built with Angular. 
[See live demo here.](https://ngx-interactive-paycard.netlify.app/)

# Using the library
The library is published in Angular package format. To install the library run in the consumer project following command:

```bash
npm install ngx-interactive-paycard 
```

Import the component:

```javascript
import { InteractivePaycardComponent } from 'ngx-interactive-paycard';
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
import { CardLabel, FormLabel, CardModel, InteractivePaycardComponent } from 'ngx-interactive-paycard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [InteractivePaycardComponent]
})
export class AppComponent {
  cardNumberFormat = '#### #### #### ####';
  cardNumberMask = '#### **** **** ####';
  // ex: Optional cardLabels
  cardLabel: CardLabel = {
    expires: 'Expires',
    cardHolder: 'Card Holder',
    fullName: 'Full Name',
    mm: 'MM',
    yy: 'YY',
  };
  // ex: Optional formLabels
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
```

A working example can be found in the `ngx-interactive-paycard-demo` folder in the repository of the library.

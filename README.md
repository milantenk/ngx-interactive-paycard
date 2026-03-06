# ngx-interactive-paycard

A parameterizable animated payment card built with Angular. 
[See live demo here.](https://ngx-interactive-paycard.netlify.app/)

<p align="center">
  <img src="paycard-demo.gif" alt="Demo gif"/>
</p>

[![CI](https://github.com/milantenk/ngx-interactive-paycard/actions/workflows/ci.yml/badge.svg)](https://github.com/milantenk/ngx-interactive-paycard/actions/workflows/ci.yml)
[![codecov.io Code Coverage](https://img.shields.io/codecov/c/github/milantenk/ngx-interactive-paycard/master.svg?style=flat)](http://codecov.io/github/milantenk/ngx-interactive-paycard?branch=master)
[![Npm version](https://img.shields.io/npm/v/ngx-interactive-paycard.svg?style=flat)](https://www.npmjs.com/package/ngx-interactive-paycard)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/milantenk/ngx-interactive-paycard/blob/master/CONTRIBUTING.md)

# Using the library
The library is published in Angular package format on in the global registry of `npmjs`. To install the library run in the consumer project following command:

```bash
npm install ngx-interactive-paycard 
```

Import the component:

```javascript
import { InteractivePaycardComponent } from 'ngx-interactive-paycard';

@Component({
  selector: 'app-example',
  template: `<ngx-interactive-paycard ...></ngx-interactive-paycard>`,
  imports: [InteractivePaycardComponent]
})
export class ExampleComponent { }
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
  styleUrls: ['./app.component.scss'],
  imports: [InteractivePaycardComponent]
})
export class AppComponent {
  title = 'ngx-interactive-paycard-demo';
  cardNumberFormat = "#### #### #### ####";
  cardNumberMask = "#### **** **** ####";
  //ex: Optional cardLabels
  cardLabel: CardLabel = {
    expires: 'Expires',
    cardHolder: 'Card Holder',
    fullName: 'Full Name',
    mm: 'MM',
    yy: 'YY',
  };
  //ex: Optional formLabels
  formLabel: FormLabel = {
    cardNumber: 'Card Number',
    cardHolderName: 'Card Holder Name',
    expirationDate: 'Expiration Date',
    expirationMonth: 'Month',
    expirationYear: 'Year',
    cvv: 'CVV',
    submitButton: 'Submit',
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

A working example can be found in the `ngx-interactive-paycard-demo` folder in this repository.

# Development of the library
To develop the library the `LTS` version of `node.js` needs to be installed. 
In this repository there is an Angular workspace which contains following projects
* `ng-interactive-paycard-lib`: The source code of the card library.
* `ng-interactive-paycard-demo`: The consumer that is used for the library development and to showcase the features of the library.

To install the dependencies of the workspace run 

```bash
npm install
```

To start the library and the demo project in watch mode run 

```bash
npm run watch:all
```

The demo of the library will be reachable on `http://localhost:4200`.

# Contributing
See `CONTRIBUTING.md`.

# References
This project is inspired by [vue-interactive-paycard](https://github.com/muhammederdem/vue-interactive-paycard). 

The goal of this project is to have an Angular alternative for the original vue based version.

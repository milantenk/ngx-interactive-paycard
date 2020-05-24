import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-interactive-paycard-demo';
  cardNumberFormat = "#### #### #### ####";
  cardNumberMask = "#### **** **** ####";

  onSubmitEvent($event) {
    console.log($event);
  }
}

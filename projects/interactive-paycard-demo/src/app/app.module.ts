import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InteractivePaycardModule } from 'interactive-paycard-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InteractivePaycardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

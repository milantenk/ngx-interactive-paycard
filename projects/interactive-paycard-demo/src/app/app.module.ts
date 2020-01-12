import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InteractivePaycardLibModule } from 'projects/interactive-paycard-lib/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InteractivePaycardLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

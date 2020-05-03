import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common"
import { InteractivePaycardComponent } from './interactive-paycard.component';
import { CardComponent } from './card/card.component';
import { OnlyNumbersDirective } from './shared/only-numbers.directive';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IfChangesDirective } from './shared/if-changes.directive';

@NgModule({
  declarations: [InteractivePaycardComponent, CardComponent, OnlyNumbersDirective, IfChangesDirective],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [InteractivePaycardComponent]
})
export class InteractivePaycardModule { }

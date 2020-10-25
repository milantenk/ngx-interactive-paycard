import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardComponent } from './card/card.component';
import { InteractivePaycardComponent } from './interactive-paycard.component';
import { IfEveryChangesDirective } from './shared/if-every-changes.directive';
import { IfUndefinedChangesDirective } from './shared/if-undefined-changes.directive';

@NgModule({
  declarations: [InteractivePaycardComponent, CardComponent, IfUndefinedChangesDirective, IfEveryChangesDirective],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [InteractivePaycardComponent]
})
export class InteractivePaycardModule { }

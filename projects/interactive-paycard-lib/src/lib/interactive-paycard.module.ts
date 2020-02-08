import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common"
import { InteractivePaycardComponent } from './interactive-paycard.component';
import { CardFormComponent } from './card-form/card-form.component';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [InteractivePaycardComponent, CardFormComponent, CardComponent],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [InteractivePaycardComponent]
})
export class InteractivePaycardModule { }

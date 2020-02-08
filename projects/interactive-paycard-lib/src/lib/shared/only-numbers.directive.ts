import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[onlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initValue.replace(/[^0-9]*/g, '');
    if ( initValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
import { Directive, ElementRef, HostListener, ChangeDetectorRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[onlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2 ) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initValue = this.elementRef.nativeElement.value;
    this.renderer.setValue(this.elementRef.nativeElement.value, initValue.replace(/[^0-9]*/g, ''))
    //this.elementRef.nativeElement.value = initValue.replace(/[^0-9]*/g, '');
    if (initValue !== this.elementRef.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
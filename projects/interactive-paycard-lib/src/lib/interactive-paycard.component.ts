import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'interactive-paycard',
  templateUrl: 'interactive-paycard.component.html',
  styles: []
})
export class InteractivePaycardComponent implements OnInit {

  @Input() chipImgPath: string;
  @Input() logoImgPath: string;
  @Input() backBgImgPath: string; 
  @Input() frontBgImgPath: string; 

  constructor() { }

  ngOnInit() {
  }

}

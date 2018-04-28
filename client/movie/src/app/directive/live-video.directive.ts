import { Directive, ElementRef, HostListener, OnInit  } from '@angular/core';

@Directive({
  selector: '[appLiveVideo]'
})
export class LiveVideoDirective {

  constructor(
    private el:ElementRef
  ) {}

   ngOnInit(){
    let height = this.el.nativeElement.offsetHeight;
    this.el.nativeElement.style.width = (height * 16)/9 + 'px';
   }

   @HostListener('window:resize') dynamicHeight(){
    let height = this.el.nativeElement.offsetHeight;
    this.el.nativeElement.style.width = (height * 16)/9 + 'px';
   }

}

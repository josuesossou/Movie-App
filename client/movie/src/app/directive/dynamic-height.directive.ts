import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDynamicHeight]'
})
export class DynamicHeightDirective {

  constructor(
    private el:ElementRef
  ) {
    let width = el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 3)/10 + 'px';
   }

   @HostListener('window:resize') dynamicHeight(){
      let width = this.el.nativeElement.offsetWidth;
      this.el.nativeElement.style.height = (width * 3)/10 + 'px';
   }
   @HostListener('window:load') dynamicHeightOnLoad(){
    let width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 3)/10 + 'px';
   }
}

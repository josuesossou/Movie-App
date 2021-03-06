import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appDynamicHeight]'
})
export class DynamicHeightDirective implements OnInit{

  constructor(
    private el:ElementRef
  ) {}

   ngOnInit(){
    let width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 3)/10 + 'px';
   }
   @HostListener('window:resize') dynamicHeight(){
      let width = this.el.nativeElement.offsetWidth;
      this.el.nativeElement.style.height = (width * 3)/10 + 'px';
   }

}

import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appImageHeight]'
})
export class ImageHeightDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) {}

   ngOnInit() {
    const width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 16) / 11 + 'px';
   }
   @HostListener('window:resize') dynamicHeight() {
      const width = this.el.nativeElement.offsetWidth;
      this.el.nativeElement.style.height = (width * 16) / 11 + 'px';
   }

}

import { Directive, ElementRef, HostListener, OnInit  } from '@angular/core';

@Directive({
  selector: '[appVideoWidth]'
})
export class VideoWidthDirective implements OnInit {

  constructor(
    private el:ElementRef
  ) {}

   ngOnInit(){
    let width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 9)/16 + 'px';
   }

   @HostListener('window:resize') dynamicHeight(){
    let width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 9)/16 + 'px';
   }
}

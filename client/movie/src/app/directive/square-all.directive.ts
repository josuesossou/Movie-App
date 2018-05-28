import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appSquareAll]'
})
export class SquareAllDirective implements OnInit {

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    const width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = width + 'px';
  }
}

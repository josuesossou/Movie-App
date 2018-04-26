import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNavbar]'
})
export class NavbarDirective {

  constructor(private el:ElementRef) { 
    if(window.scrollY >= window.innerHeight && window.innerWidth >= 768) {
      this.el.nativeElement.style.display = 'flex';
      this.el.nativeElement.animate([
        {opacity: '0'},
        {opacity: '1'}
      ], {
        duration: 400,
        easing: 'ease'
      })

    }else{
      this.el.nativeElement.style.display = 'none';
      this.el.nativeElement.style.transition = '1s ease'
    }
  }

  @HostListener('window: scroll') hideNavbarOnScroll(){

    if(window.scrollY >= window.innerHeight && window.innerWidth >= 768 && this.el.nativeElement.style.display ==='none') {
      this.el.nativeElement.style.display = 'flex';
      this.el.nativeElement.animate([
        {opacity: '0'},
        {opacity: '1'}
      ], {
        duration: 400,
        easing: 'ease'
      })
    }else if(window.scrollY < window.innerHeight) {
      this.el.nativeElement.style.display = 'none';
    }

  }

  @HostListener('window: resize') hideNavbarOnResize(){
    if(window.scrollY >= window.innerHeight && window.innerWidth >= 768 && this.el.nativeElement.style.display ==='none') {
      this.el.nativeElement.style.display = 'flex';
      this.el.nativeElement.animate([
        {opacity: '0'},
        {opacity: '1'}
      ], {
        duration: 400,
        easing: 'ease'
      })
    }else if(window.scrollY < window.innerHeight){
      this.el.nativeElement.style.display = 'none';
    }

  }
}

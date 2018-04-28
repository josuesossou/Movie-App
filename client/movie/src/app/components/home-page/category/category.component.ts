import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  // @ContentChild({ read: TemplateRef }) 
  // child: TemplateRef<any>;

  // @ViewChild('container', { read: ViewContainerRef })
  // container: ViewContainerRef;

  @Input('da') dagf: string;

  data:string[] = [
    "hello",
    "welcom",
    "you",
    "now",
    "welcom",
    "you",
    "now",
    "me"
  ]
  
  constructor(
    public router:Router
  ) { }

  ngOnInit() {
    console.log(this.dagf);
  }

  purchase(d){
    console.log('puchase', d);
    this.router.navigate([`/purchase/${d}`])
  }
}

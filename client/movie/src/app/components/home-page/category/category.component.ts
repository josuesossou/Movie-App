import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  @Input() da: string;

  data: string[] = [
    'Hello',
    'Hello',
    'Hello',
    'Hello',
    'Hello',
    'Hello',
    'Hello',
    'Hello',
  ];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    console.log(this.da);
  }

  purchase(d) {
    console.log('puchase', d);
    this.router.navigate([`/purchase/${d}`]);
  }
}

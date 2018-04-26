import { Component, OnInit, ContentChild, ContentChildren } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

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
  
  constructor() { }

  ngOnInit() {
  
    console.log()
  }
}

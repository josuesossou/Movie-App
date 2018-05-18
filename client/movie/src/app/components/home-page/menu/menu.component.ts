import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../../../model/chat-rooms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() 'joinedRoom': Room[];

  constructor() { }

  ngOnInit() {
  }

}

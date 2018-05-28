import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../../../model/chat-rooms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() 'room': Room;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  enterRoom() {
    this.router.navigate([`/chat-room/${this.room.room_name}`]);
  }

}

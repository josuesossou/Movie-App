import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-world-chat',
  templateUrl: './world-chat.component.html',
  styleUrls: ['./world-chat.component.css']
})
export class WorldChatComponent implements OnInit {
  needChat:boolean = false
  constructor() { }

  ngOnInit() {
  }

}

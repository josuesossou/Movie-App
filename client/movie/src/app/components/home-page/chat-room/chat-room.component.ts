import { Component, OnInit } from '@angular/core';
import { Chat } from '../../../model/chat-rooms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  data:Chat[] = [
    {
      creatorName: "Kojo",
      roomNameShort: "Black Panter",
      roomName: "Black Panter",
      roomSize: 5
    },
    {
      creatorName: "Kokoo",
      roomNameShort: "Dawn At the Planet of the Apes",
      roomName: "Dawn At the Planet of the Apes",
      roomSize: 52
    },
    {
      creatorName: "Kojo",
      roomNameShort: "Batman",
      roomName: "Batman",
      roomSize: 532
    },
    {
      creatorName: "Kojo",
      roomNameShort: "Iron Man",
      roomName: "Iron Man",
      roomSize: 52
    },
    {
      creatorName: "Kojo",
      roomNameShort: "Matrix",
      roomName: "Matrix",
      roomSize: 544
    },
    {
      creatorName: "Kojo",
      roomNameShort: "The Fantastic Four",
      roomName: "The Fantastic Four",
      roomSize: 512
    },
    {
      creatorName: "Kojo",
      roomNameShort: "Spidy",
      roomName: "Spidy",
      roomSize: 55
    },
    {
      creatorName: "Kojo",
      roomNameShort: "Black Panter",      
      roomName: "Black Panter",
      roomSize: 5
    },
    {
      creatorName: "Kojo",
      roomNameShort: "Black Panter",
      roomName: "Black Panter",
      roomSize: 5
    },
  ]

  isCreateRoom:boolean = false;

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
    this.data.forEach(d=>{
      if(d.roomName.length > 10 ) {
        d.roomNameShort = d.roomNameShort.slice(0,9) + '...';
      }
    })
  }

  enterRoom(name){
    if(confirm(`Do you want to join ${name}?`)){
      this.router.navigate([`chat-room/${name}`])
    }
  }

  createRoom() {
    this.isCreateRoom = false;
  }
}

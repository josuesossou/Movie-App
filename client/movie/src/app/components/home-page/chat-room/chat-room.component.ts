import { Component, OnInit } from '@angular/core';
import { Chat } from '../../../model/chat-rooms';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  data:Chat[] = [
    {
      creatorName: "Kojo",
      roomName: "Black Panter",
      roomSize: 5
    },
    {
      creatorName: "Kokoo",
      roomName: "Dawn At the Planet of the Apes",
      roomSize: 52
    },
    {
      creatorName: "Kojo",
      roomName: "Batman",
      roomSize: 532
    },
    {
      creatorName: "Kojo",
      roomName: "Iron Man",
      roomSize: 52
    },
    {
      creatorName: "Kojo",
      roomName: "Matrix",
      roomSize: 544
    },
    {
      creatorName: "Kojo",
      roomName: "The Fantastic Four",
      roomSize: 512
    },
    {
      creatorName: "Kojo",
      roomName: "Spidy",
      roomSize: 55
    },
    {
      creatorName: "Kojo",
      roomName: "Black Panter",
      roomSize: 5
    },
    {
      creatorName: "Kojo",
      roomName: "Black Panter",
      roomSize: 5
    },
  ]
  constructor() { 
    
  }

  ngOnInit() {
    this.data.forEach(d=>{
      if(d.roomName.length > 10 ) {
        d.roomName = d.roomName.slice(0,9) + '...';
      }
    })
  }

  enterRoom(){
    console.log('working')
  }

}

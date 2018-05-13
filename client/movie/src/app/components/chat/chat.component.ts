import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../services/socket-io.service';
import { Message } from '../../model/message'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message:Message;
  //getting room name
  roomName:string;

  constructor(private socketIO:SocketIoService) { }

  ngOnInit() {
    this.socketIO.removeSocketEvent('roomMessage');
  }
  
  sendGroupMessage() {
    this.message = {
      roomName: '',
      senderName: '',
    }

    this.socketIO.sendMessage('groupMessage', this.message)
  }
}

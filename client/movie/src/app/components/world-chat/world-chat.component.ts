import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketIoService } from '../../services/socket-io.service';
import { Message } from '../../model/message';

@Component({
  selector: 'app-world-chat',
  templateUrl: './world-chat.component.html',
  styleUrls: ['./world-chat.component.css']
})
export class WorldChatComponent implements OnInit {
  needChat = false;
  message: string;
  joinedWC = false;
  chatMessage: Message;
  messages: Message[] = [];

  constructor(
    private socketIO: SocketIoService
  ) { }

  ngOnInit() {
    this.socketIO.removeSocketEvent('newWorldChatMessage');
    console.log('working');
  }

  connectToIOServer() {
    if ( !this.joinedWC && confirm('Would you like to join the World Chat?')) {
      this.needChat = !this.needChat;
      // receiving messages on new world chat message event
      this.socketIO.receiveMessage('newWorldChatMessage').subscribe(message => {
        this.messages.push(message);
        console.log(message);
      });
      this.joinedWC = true;
    } else if (this.joinedWC) {
      this.needChat = !this.needChat;
    }
  }

  sendMessage () {
    this.chatMessage = {
      messageText: this.message,
    };
    this.socketIO.sendMessage('worldChatMessage', this.chatMessage);
  }

}

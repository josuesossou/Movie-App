import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketIoService } from '../../services/socket-io.service';
import { Message } from '../../model/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, Member } from '../../model/chat-rooms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  message: Message = {};
  text: string;
  roomName: string;
  chatRoom: Room;
  membersInRoom = [];

  constructor(
    private socketIO: SocketIoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.socketIO.updateRoomMemberStatus({
      memberId: '',
      status: true
    });

    this.socketIO.receiveMessage('newGroupMessage').subscribe((message: Message) => {
      this.messages.push(message);

      if (message.isJoinMessage || message.isLeaveMessage) {
        this.getChatRoomData().then((chatroom: Room) => {
          this.chatRoom = chatroom;
          this.membersInRoom = this.chatRoom.members.filter(member => member.status === true);
          console.log(this.membersInRoom);
        }).catch(err => {
          console.log(err);
        });
      }
    });

    this.message.messageText = '';
    this.message.isJoinMessage = true;
    this.message.isLeaveMessage = false;

    this.socketIO.sendMessage('groupMessage', this.message);
  }

  getChatRoomData() {
    // get room info
    return this.socketIO.getChatRoom().then(chatRoom => {
      console.log(chatRoom);
      return Promise.resolve(chatRoom);
    }).catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
  }

  sendGroupMessage() {
    this.message.messageText = this.text;
    this.message.isJoinMessage = false;

    this.socketIO.sendMessage('groupMessage', this.message);
    this.text = '';
  }

  ngOnDestroy() {
    this.message.messageText = '';
    this.message.isLeaveMessage = true;
    this.message.isJoinMessage = false;

    this.socketIO.updateRoomMemberStatus({
      memberId: '',
      status: false
    }).then((res) => {
      console.log(res);
      this.socketIO.sendMessage('groupMessage', this.message);
    });
    this.socketIO.removeSocketEvent('newGroupMessage');
  }
}

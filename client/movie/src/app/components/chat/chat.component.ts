import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketIoService } from '../../services/socket-io.service';
import { Message } from '../../model/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, Member } from '../../model/chat-rooms';
import ObjectID from 'bson-objectid';

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
    // set isInChat to true meaning that the user is in a chat room
    this.socketIO.isInChat = true;

    // joins the user to the room
    this.socketIO.emitJoinRoom();

    // updates your status as online or offline
    this.socketIO.updateRoomMemberStatus({
      memberId: '',
      status: true
    });
    // sets chat room to receive messages from websocket
    this.socketIO.receiveMessage('newGroupMessage').subscribe((message: Message) => {
      // change the message class when the user sending the message is the same user recieving the message
      if (message.senderId === this.socketIO.user._id) {
        message.class = 'self-message';
        message.isToGroup = false;
      }

      // push message in an array
      this.messages.push(message);

      console.log(message);

      if (message.isJoinMessage ||
        message.isLeaveMessage ||
        message.isDisconectMessage ||
        message.isConnectedMessage ||
        message.newMember ||
        message.isLeave) {
        this.getChatRoomData().then((chatroom: Room) => {
          this.chatRoom = chatroom;

          this.membersInRoom = this.chatRoom.members.filter(member => member.status === true);

          this.chatRoom.members.forEach(member => {
            member.timeJoined = new ObjectID(member._id).getTimestamp();

            if (member.memberId === this.socketIO.user._id) {
              member.me = true;
            }
          });
        }).catch(err => {
          this.socketIO.generateFlashMessage(err, 'alert-danger', 3000);
        });
      }
    });

    // send group message when user enters a chat room
    this.message.messageText = '';
    this.message.isJoinMessage = true;
    this.message.isLeaveMessage = false;
    this.message.isConnectedMessage = false;

    this.socketIO.sendMessage('groupMessage', this.message);
  }

  // geting the chat room data
  getChatRoomData() {
    return this.socketIO.getChatRoom().then(chatRoom => {
      return Promise.resolve(chatRoom);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  sendGroupMessage() {
    this.text = this.text.trim();

    console.log(this.text);
    if (this.text === '' || this.text === undefined) {
      return;
    }


    this.message.messageText = this.text;
    this.message.isJoinMessage = false;

    this.socketIO.sendMessage('groupMessage', this.message);
    this.text = '';
  }

  leaveRoom() {
    if (confirm('Are you sure you want to leave this room?')) {
      const data = {
        joinRoomName: '',
        room_name: '',
        isJoinedRoom: false,
        isRoomCreator: false
      };

      this.message.isLeave = true;
      this.message.isJoinMessage = false;
      this.message.isLeaveMessage = false;
      this.message.joinedRoomName = this.socketIO.userData.joinRoomName;
      this.message.roomName = this.socketIO.userData.room_name;

      this.socketIO.leaveRoom(data).then(doc => {
        this.socketIO.sendMessage('leave', this.message);
        this.router.navigate(['/']);
      });
    }
  }

  ngOnDestroy() {
    this.message.messageText = '';
    this.message.isLeaveMessage = true;
    this.message.isJoinMessage = false;
    if (this.message.isLeave) {
      this.socketIO.generateFlashMessage(`You successfully left ${this.message.roomName}`, 'alert-success', 3000);
      return;
    }

    this.socketIO.updateRoomMemberStatus({
      memberId: '',
      status: false
    }).then((res) => {
      this.socketIO.sendMessage('groupMessage', this.message);
    });
    this.socketIO.removeSocketEvent('newGroupMessage');

    // set isInChat to false meaning that the user left the chat room
    this.socketIO.isInChat = false;
  }
}

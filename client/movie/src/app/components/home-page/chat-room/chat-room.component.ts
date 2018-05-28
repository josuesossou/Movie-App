import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../../../model/chat-rooms';
import { Router } from '@angular/router';
import { SocketIoService } from '../../../services/socket-io.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  @Input() 'rooms': Room[];

  isCreateRoom = false;
  roomName: string;

  constructor(
    private router: Router,
    private socketIO: SocketIoService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {

  }

  joinRoom(name, id) {
    if (!this.socketIO.userData.isJoinedRoom) {
      if (confirm(`Do you want to join ${name}?`)) {
        this.joiningRoom(name, id);
      }
    } else {
      if (confirm(`Do you want to join ${name}? You will automatically be removed from any currently joined room.`)) {
        const data = {
          joinRoomName: '',
          room_name: '',
          isJoinedRoom: false,
          isRoomCreator: false
        };

        this.socketIO.leaveRoom(data).then(doc => {
          this.joiningRoom(name, id);
        });
      }
    }
  }

  joiningRoom(name, id) {
    const data = {
      joinRoomName: id,
      room_name: name,
      isJoinedRoom: true,
      isRoomCreator: false
    };

    this.socketIO.joinRoom(data, id).then(res => {
      this.flashMessage.show(`You have successfully Joined ${name}`, { cssClass: 'alert-success', timeout: 3000 });
      this.router.navigate([`chat-room/${name}`]);
    }).catch(e => {
      this.flashMessage.show(e, { cssClass: 'alert-danger', timeout: 3000 });
    });
  }

  createRoom() {
    if (confirm(`Do you want to create ${this.roomName} room?`)) {
      // data for userdata
      const data = {
        joinRoomName: '',
        room_name: this.roomName,
        isJoinedRoom: true,
        isRoomCreator: true
      };
      // data for chat room
      const chatRoomData = {
        room_name: this.roomName,
      };

      this.socketIO.createRoom(data, chatRoomData).then((d) => {
        this.flashMessage.show(`${this.roomName} was successfully created`, { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate([`chat-room/${this.roomName}`]);
        this.roomName = '';
        this.isCreateRoom = false;
      }).catch(e => {
        this.flashMessage.show(`${e} '${this.roomName}'. Name already exist.`, { cssClass: 'alert-danger', timeout: 3000 });
      });
    }
  }
}

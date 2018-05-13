import { Component, OnInit } from '@angular/core';
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

  rooms:Room[];

  isCreateRoom:boolean = false;
  roomName:string;

  constructor(
    private router:Router,
    private socketIO:SocketIoService,
    private flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
    this.socketIO.getChatRooms().then((rooms:Room[]) => {
      this.rooms = rooms;
      //making sure long names are cut short
      this.rooms.forEach(room => {
        if(room.room_name.length > 10 ) {
          return room.roomNameShort = room.room_name.slice(0,9) + '...';
        } else {
          return room.roomNameShort = room.room_name;
        }
      });
      console.log(this.rooms)
    }).catch(e => {
      console.log(e)
    });
  }

  enterRoom(name, id){
    if(confirm(`Do you want to join ${name}?`)){
      const data = {
        joinRoomName: id,
        room_name: name,
        isJoinedRoom: true,
        isRoomCreator: false
      };

      this.socketIO.joinRoom(data, id)
      this.router.navigate([`chat-room/${name}`])
    }
  }

  createRoom() {
    this.isCreateRoom = false;
    if(confirm(`Do you want to create ${this.roomName} room?`)){
      const data = {
        joinRoomName: '',
        room_name: this.roomName,
        isJoinedRoom: true,
        isRoomCreator: true
      };

      const chatRoomData = {
        room_name: this.roomName,
      }

      this.socketIO.createRoom(data, chatRoomData).then((d) => {
          this.flashMessage.show('Room was successfully created', { cssClass: 'alert-success', timeout: 3000 });
          this.router.navigate([`chat-room/${this.roomName}`]);
      }).catch(e => {
        this.flashMessage.show('Room name already exist. Chose another name', { cssClass: 'alert-danger', timeout: 3000 });
      });
    }
  }
}

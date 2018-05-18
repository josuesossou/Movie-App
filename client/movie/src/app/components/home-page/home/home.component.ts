import { Component, OnInit, Input } from '@angular/core';
import { SocketIoService } from '../../../services/socket-io.service';
import { Room } from '../../../model/chat-rooms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  rooms: Room[];
  joinedRoom: Room[];

  categories: string[] = [
    'One',
    'Two',
    'Three'
  ];

  constructor(
    private socketIO: SocketIoService
  ) { }

  ngOnInit() {
    this.socketIO.getChatRooms().then((rooms: Room[]) => {
      this.rooms = rooms;

      // making sure long names are cut short
      this.rooms.forEach(room => {
        if (room.room_name.length > 10 ) {
          return room.roomNameShort = room.room_name.slice(0, 9) + '...';
        } else {
          return room.roomNameShort = room.room_name;
        }
      });
      console.log(this.rooms);

      if (this.socketIO.userData.isJoinedRoom) {
        this.joinedRoom = this.rooms.filter(room => room._id === this.socketIO.userData.joinRoomName);
      }
      console.log(this.joinedRoom);
    }).catch(e => {
      console.log(e);
    });

  }

}

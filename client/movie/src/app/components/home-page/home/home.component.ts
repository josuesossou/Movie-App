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
  room: Room;

  username;

  categories: Object[];

  constructor(
    private socketIO: SocketIoService
  ) { }

  ngOnInit() {
    this.socketIO.socketConnection();
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

      if (this.socketIO.userData.isJoinedRoom) {
        this.joinedRoom = this.rooms.filter(room => room._id === this.socketIO.userData.joinRoomName);

        this.room = this.joinedRoom[0];
      }


      this.username = this.socketIO.user.username;
    }).catch(e => {
      console.log(e);
    });

    // set user status to false
    if (this.socketIO.userData.isJoinedRoom) {
      this.socketIO.updateRoomMemberStatus({
        memberId: '',
        status: false
      }).then((res) => {
      });
    }

    this.socketIO.getCategories().then((categories: Object[]) => {
      console.log('categories', categories);
      this.categories = categories;
    }).catch();
  }

}

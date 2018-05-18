import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

import { Message } from '../model/message';
import { User, UserData } from '../model/user';
import { Room } from '../model/chat-rooms';

const headerOptions = {
  body: null,

  headers: new HttpHeaders({
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWY2OWQzYTFjNmNiMDNkOGY0MmExMTkiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTI2MTExNzkyfQ.yVOQFKcNXcvTH-54w42CaE-MouoUev5OBf9hDtVecF8',
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SocketIoService {

  socket;
  user: User;
  userData: UserData;

  constructor( private http: HttpClient) {
    // connection to the server
    this.socket = io('http://localhost:3001');

    // connect event
    this.socket.on('connect', () => {
      console.log('connect');
      if (this.userData && this.userData.isJoinedRoom) {
        this.emitJoinRoom(this.userData.joinRoomName);
      }
    });
  }

  sendApiReq(data, url, method) {
    if (data) {
      headerOptions.body = data;
    }

    return this.http.request(
      method,
      url,
      headerOptions,
    ).toPromise().then(response => {
      if (!response) {
        return Promise.reject('no response');
      }
      return Promise.resolve(response);
    }).catch(e => {
      return Promise.reject(e);
    });
  }

  sendMessage(eventName: string, message: Message) {
    message.timeStamp = new Date().getTime();

    switch (eventName) {
      case 'groupMessage':
      case 'joinedGroupMessage':
      message.senderName = 'Josue';
      message.senderId = this.userData.user_id;
      message.joinedRoomName = this.userData.joinRoomName;
      message.roomName = this.userData.room_name;
      break;
    }

    this.socket.emit(eventName, message, err => {
      console.log(err);
    });
  }

  // receiving world chat message
  receiveMessage(eventName: string) {
    return new Observable<any>(observer => {
      this.socket.on(eventName, (message: Message) => {
        observer.next(message);
      });
    });
  }

  // function that join a user to a room
  emitJoinRoom(name) {
    this.socket.emit('joinRoom', name, err => {
      Promise.reject(err);
    });
  }
  // update chat room
  async updateChatRoom(chatRoomSendData, method: string) {
    const roomUrl = `http://localhost:3000/chat-rooms/${this.userData.joinRoomName}`;

    const chatRoomUpdateData = await this.sendApiReq(chatRoomSendData, roomUrl, method);
    return chatRoomUpdateData;
  }

  // when a user left the chat room page, he/she becomes offline
  async updateRoomMemberStatus(data) {
    data.memberId = this.userData.user_id;

    const url = `http://localhost:3000/chat-room-status/${this.userData.joinRoomName}`;

    const chatRoomUpdateData = await this.sendApiReq(data, url, 'patch');

    return chatRoomUpdateData;
  }

  // join a room
  async joinRoom(data, name: string) {
    const userDataUrl = 'http://localhost:3000/users-data/user';

    const userData: any = await this.sendApiReq(data, userDataUrl, 'patch');

    if (!userData) {
      return Promise.reject('Unable to update UserData');
    }
    this.userData = userData;

    const chatRoomSendData = {
      member: {
        memberName: 'New Josue',
        memberId: this.userData.user_id,
        status: true,
      }
    };

    this.updateChatRoom(chatRoomSendData, 'patch').then(room => {
      console.log('chatroomdata', room);
    });

    this.emitJoinRoom(name);
    console.log('userData', userData);
  }

  // create a room
  createRoom(data, chatRoomData) {
    const url = 'http://localhost:3000/chat-rooms';

    return this.sendApiReq(chatRoomData, url, 'post').then((res: Room) => {
      if (!res) {
        return Promise.reject('Unable to create room');
      }
      data.joinRoomName = res._id;

      return this.joinRoom(data, res._id).then(() => {
        return Promise.resolve();
      });
    }).catch(e => {
      return Promise.reject('Unable to create room');
    });
  }

  // leaving a room permanantly
  async leaveRoom(data) {
    const userDataUrl = 'http://localhost:3000/users-data/user';

    const userData: any = await this.sendApiReq(data, userDataUrl, 'patch');

    if (!userData) {
      return Promise.reject('Unable to update UserData');
    }

    this.userData = userData;

    const chatRoomSendData = {
      memberId: this.userData.user_id
    };
    this.updateChatRoom(chatRoomSendData, 'delete').then(room => {
      console.log('chatroomdata', room);
    });
  }

  // get all the chat rooms
  getChatRooms() {
    const url = 'http://localhost:3000/chat-rooms';

    return this.sendApiReq(null, url, 'get').then(rooms => {
      if (!rooms) {
        return Promise.reject('no room was found');
      }
      return Promise.resolve(rooms);
    });
  }

  // get one chat room
  getChatRoom() {
    if (!this.userData) {
      return Promise.reject('Could not get room');
    }

    const id = this.userData.joinRoomName;
    const url = `http://localhost:3000/chat-rooms/${id}`;

    return this.sendApiReq(null, url, 'get').then(room => {
      if (!room) {
        return Promise.reject('Could not get room');
      }
      return Promise.resolve(room);
    });
  }

  removeSocketEvent(eventName: string) {
    this.socket.off(eventName);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Message } from '../model/message';
import { User, UserData } from '../model/user';
import { Room } from '../model/chat-rooms';
import { ApiCalls } from '../lib/api-calls';

// path to user dat endpoint
const userDataUrl = 'http://localhost:3000/users-data/user';

@Injectable()
export class SocketIoService {

  socket;
  user: User;
  userData: UserData;
  isInChat = false;

  constructor(
    private api: ApiCalls,
    private flashMessage: FlashMessagesService,
  ) {}

  // setting socket connect and disconect connection
  socketConnection() {
    this.socket = io('http://localhost:3000');

    if (this.user && this.userData) {
      this.socket.on('connect', () => {
        const data: any = {
          socketId: this.socket.id,
        };

        this.api.sendApiReq(data, userDataUrl, 'patch');

        if (this.userData.isJoinedRoom && this.isInChat) {
          this.emitJoinRoom();

          this.updateRoomMemberStatus({ status: true });

          const message: Message = {
            messageText: '',
            isJoinMessage: false,
            isLeaveMessage: false,
            isConnectedMessage: true,
          };

          this.sendMessage('groupMessage', message);
        }

        this.api.sendApiReq(data, userDataUrl, 'patch');
      });

      this.socket.on('disconnect', () => {
        this.generateFlashMessage('You have been disconnected', 'alert-danger', 5000);
      });
    }
  }

  closeSocket() {
    this.socket.disconnect();
  }

  authState() {
    return new Observable<boolean>(observer => {
      if (!this.user || !this.userData) {
        return observer.next(false);
      }
      observer.next(true);
    });
  }

  sendMessage(eventName: string, message: Message) {
    message.timeStamp = new Date().getTime();

    switch (eventName) {
      case 'groupMessage':
      case 'joinedGroupMessage':
      message.senderName = this.user.username;
      message.senderId = this.userData.user_id;
      message.joinedRoomName = this.userData.joinRoomName;
      message.roomName = this.userData.room_name;
      break;

      case 'leave':
      message.senderName = this.user.username;
      message.senderId = this.userData.user_id;
      break;
    }

    this.socket.emit(eventName, message, err => {});
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
  emitJoinRoom() {
    this.socket.emit('joinRoom', this.userData.joinRoomName, err => {
      Promise.reject(err);
    });
  }
  // update chat room
  async updateChatRoom(chatRoomSendData, method: string) {
    const roomUrl = `http://localhost:3000/chat-rooms/${this.userData.joinRoomName}`;

    const chatRoomUpdateData = await this.api.sendApiReq(chatRoomSendData, roomUrl, method);
    return chatRoomUpdateData;
  }

  // when a user left the chat room page, he/she becomes offline
  async updateRoomMemberStatus(data) {
    data.memberId = this.userData.user_id;

    const url = `http://localhost:3000/chat-room-status/${this.userData.joinRoomName}`;

    const chatRoomUpdateData = await this.api.sendApiReq(data, url, 'patch');

    return chatRoomUpdateData;
  }

  // join a room
  async joinRoom(data, name: string) {
    data.socketId = this.socket.id;

    const userData: any = await this.api.sendApiReq(data, userDataUrl, 'patch');

    if (!userData) {
      return Promise.reject('Unable to update UserData');
    }
    this.userData = userData;

    const chatRoomSendData = {
      member: {
        memberName: this.user.username,
        memberId: this.userData.user_id,
        status: true,
      }
    };

    this.updateChatRoom(chatRoomSendData, 'patch').then(room => {
      const message: Message = {
        messageText: '',
        newMember: true,
        isJoinMessage: false,
        isLeaveMessage: false,
        isConnectedMessage: false,
      };

      this.sendMessage('groupMessage', message);
    });
  }

  // create a room
  createRoom(data, chatRoomData) {
    const url = 'http://localhost:3000/chat-rooms';

    return this.api.sendApiReq(chatRoomData, url, 'post').then((res: Room) => {
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
  leaveRoom(data) {
    data.socketId = '';

    const chatRoomSendData = {
      memberId: this.userData.user_id
    };

    return this.updateChatRoom(chatRoomSendData, 'delete').then(room => {
      return this.api.sendApiReq(data, userDataUrl, 'patch').then((userData: UserData) => {
        this.userData = userData;
      });
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  // get all the chat rooms
  getChatRooms() {
    const url = 'http://localhost:3000/chat-rooms';

    return this.api.sendApiReq(null, url, 'get').then(rooms => {
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

    return this.api.sendApiReq(null, url, 'get').then(room => {
      if (!room) {
        return Promise.reject('Could not get room');
      }
      return Promise.resolve(room);
    });
  }

  getUserData() {
    const url = `http://localhost:3000/users-data`;
    return this.api.sendApiReq(null, url, 'get');
  }

  getCategories() {
    const url = `http://localhost:3000/categories`;
    return this.api.sendApiReq(null, url, 'get');
  }

  getQuerriedMovies(category) {
    const url = `http://localhost:3000/querymovies`;
    return this.api.sendApiReq({ category }, url, 'post');
  }

  getOneMovie(id) {
    const url = `http://localhost:3000/movies/${id}`;
    return this.api.sendApiReq(null, url, 'get');
  }

  removeSocketEvent(eventName: string) {
    this.socket.off(eventName);
  }

  // generating flash messages
  generateFlashMessage(text: string, cssclass: string, time: number) {
    this.flashMessage.show(text, { cssClass: cssclass, timeout: time });
  }

}

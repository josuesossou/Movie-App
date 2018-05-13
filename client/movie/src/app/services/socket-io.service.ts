import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

import { Message, UserData } from '../model/message';
import { User } from '../model/user';
import { Room } from '../model/chat-rooms';

const headerOptions = {
  body:null,
  headers:new HttpHeaders({
    'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWY2OWQzYTFjNmNiMDNkOGY0MmExMTkiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTI2MTExNzkyfQ.yVOQFKcNXcvTH-54w42CaE-MouoUev5OBf9hDtVecF8',
    'Content-Type': 'application/json'
  })
}

@Injectable()
export class SocketIoService {

  socket;
  user:User;

  constructor( private http:HttpClient) { 
    //connection to the server
    this.socket = io('http://localhost:3001');

    //connect event
    this.socket.on('connect', () => {
      console.log('connect')
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
      console.log('req',response);
      if (!response) return Promise.reject('no response');
      return Promise.resolve(response);
    }).catch(e => {
      return Promise.reject(e);
    })
  }

  sendMessage(eventName:string, message:Message) {
    //sending world chat message
    this.socket.emit(eventName, message, err => {
      console.log(err)
    }); 
  }

  //receiving world chat message
  receiveMessage(eventName:string) {
    return new Observable<any>(observer => {
      this.socket.on(eventName, (message:Message) => {
        observer.next(message);
      });
    })
  }

  joinRoom(data, name:string) {
    const url = 'http://localhost:3000/users-data/user';

    this.sendApiReq(data, url, 'patch').then((res:UserData) => {
      this.socket.emit('joinRoom', name, err => {
        console.log(err)
      }); 
    });
  }

  createRoom(data, chatRoomData) {
    const url = 'http://localhost:3000/chat-rooms';

    return this.sendApiReq(chatRoomData, url, 'post').then((res:Room) => {
      if (!res) return Promise.reject('error');
      data.joinRoomName = res._id;
      this.joinRoom(data, res._id);
      return Promise.resolve('success');
    }).catch(e => {
      return Promise.reject('error');
    });
  }

  getChatRooms() {
    const url = 'http://localhost:3000/chat-rooms';

    return this.sendApiReq(null, url, 'get').then(rooms => {
      if (!rooms) return Promise.reject("no room was found");
      return Promise.resolve(rooms);
    })
  }

  removeSocketEvent(eventName:string) {
    this.socket.off(eventName);
  }
}

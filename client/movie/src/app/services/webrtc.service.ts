import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare let SimpleWebRTC: any; //this is important

@Injectable()
export class WebrtcService {

  webrtc: any; //declare global variable

  constructor() { 

    this.webrtc = new SimpleWebRTC({
      url: 'http://localhost:3000',
      socketio: {},
      connection: null,
      debug: false,
      localVideoEl: 'local-video',
      remoteVideosEl: 'remote-video',
      autoRequestMedia: true,
      adjustPeerVolume: true,
      media: {
        video: true, audio: true
      }
    });
  }

   //use webrtc functions as observables
   onError() {
    return new Observable<any>(observer => {
        this.webrtc.on('error', error => {
          observer.next(error);
      });
    });
  }

  onRoomReady() {
    return new Observable<any>(observer => {
      this.webrtc.connection.on('message', data => {
        if(data.type == 'roomReady') {
          observer.next(data.payload);
        }
      });
    });
  }

  emitRoom(){
    return new Observable<any>(observer=>{
      this.webrtc.emit('roomname', 'thisroom')
    })
  }

  listenRoom(){
    return new Observable<any>(observer =>{
      this.webrtc.on('rooms', (room)=>{
        console.log('rooms',room)
      })
    })
  }


  onConnectionReady() {
      return new Observable<any>(observer => {
          this.webrtc.on('connectionReady', sessionId => {
              observer.next(sessionId);
          });
      });
    }

  onReadyToCall(roomName) {
      return new Observable<any>(observer => {
          this.webrtc.on('readyToCall', () => {
              observer.next();
              this.webrtc.joinRoom(roomName);
          });
      });
  }

  onVideoAdded() {
      return new Observable<any>(observer => {
          this.webrtc.on('videoAdded', (video, peer) => {
              observer.next({ video: video, peer: peer});
          });
      });
  }

  onVideoRemoved() {
      return new Observable<any>(observer => {
          this.webrtc.on('videoRemoved', (video, peer) => {
              observer.next({ video: video, peer: peer});
          });
      });
  }

}
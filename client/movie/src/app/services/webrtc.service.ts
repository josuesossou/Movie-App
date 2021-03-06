import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare let SimpleWebRTC: any; // this is important

@Injectable()
export class WebrtcService {

  webrtc: any; // declare global variable

  constructor() {
    this.webrtc = new SimpleWebRTC({
        url: 'http://localhost:8080',
        socketio: {},
        connection: null,
        debug: false,
        localVideoEl: 'local-video',
        remoteVideosEl: '',
        autoRequestMedia: false,
        adjustPeerVolume: true,
        autoRemoveVideos: true,
        media: {
          video: { width: 1280, height: 720 },
          audio: true
        }
    });
  }

  setUpWrtc() {
      console.log(this.webrtc);
      if (!this.webrtc) {
        this.webrtc = new SimpleWebRTC({
            url: 'http://localhost:8080',
            socketio: {},
            connection: null,
            debug: false,
            localVideoEl: 'local-video',
            remoteVideosEl: '',
            autoRequestMedia: false,
            adjustPeerVolume: true,
            autoRemoveVideos: true,
            media: {
              video: { width: 1280, height: 720 },
              audio: true
            }
        });
      }
  }

   // use webrtc functions as observables
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
                if (data.type === 'roomReady') {
                    observer.next(data.payload);
                }
            });
        });
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

    stopLocalVideo() {
        this.webrtc.stopLocalVideo();
    }

    startLocalVideo() {
        this.webrtc.startLocalVideo();
    }

    resumeLocalVideo() {
        this.webrtc.resumeVideo();
    }

    pauseLocalVideo() {
        this.webrtc.pauseVideo();
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

    leaveRoom(room) {
        this.webrtc.leaveRoom(room);
        this.webrtc.stopLocalVideo();
    }

}

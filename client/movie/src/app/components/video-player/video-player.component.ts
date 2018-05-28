import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebrtcService } from '../../services/webrtc.service';
import { SocketIoService } from '../../services/socket-io.service';
import { UserData } from '../../model/user';
import { Message } from '../../model/message';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  private readyToCallSubscription: Subscription;

  isInvited = false;
  isInGroup = false;
  needLive = false;
  needChat = false;
  needInvite = false;
  isEnable = false;
  isLoaded = false;

  movie: any;

  activeUsers: UserData[];

  roomeName = this.socketIo.userData.user_id;

  constructor(
    private router: Router,
    private webrtc: WebrtcService,
    private socketIo: SocketIoService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['vidId'];
    const joinedRoomName = this.route.snapshot.params['hostName'];

    if (joinedRoomName) {
      console.log(joinedRoomName);
      this.isEnable = true;
      this.isInGroup = true;
      this.isInvited = true;

      this.readyToCallSubscription = this.webrtc.onReadyToCall(joinedRoomName).subscribe();
    }
    this.webrtc.setUpWrtc();
    this.socketIo.getOneMovie(id).then((movie: any) => {
      this.movie = movie;
      this.isLoaded = true;
    }).catch(err => {
      this.isLoaded = true;
    });
  }

  home() {
    this.router.navigate(['/']);
  }

  show(need) {
    if (need === 'needChat') {
      this.needChat = !this.needChat;
      this.needInvite = false;
    } else {
      this.needInvite = !this.needInvite;
      this.needChat = false;
    }
  }

  getUserData() {
    this.socketIo.getUserData().then((data: UserData[]) => {
      this.activeUsers = data.filter(user => {
        if (user.socketId !== '' && user.user_id !== this.socketIo.user._id) {
          return user;
        }
      });

      this.needInvite = true;
    });
  }

  enableGroupLive() {
    if (confirm(`Do you want to enable Groupe video chat?`)) {
      this.readyToCallSubscription = this.webrtc.onReadyToCall(this.roomeName).subscribe();
      this.isEnable = true;
      this.isInGroup = true;
      console.log(this.webrtc.webrtc);
    }
  }

  sendInvitation(user) {
    if (!user) {
      return;
    }

    if (confirm(`Do you want to invite ${user.username}?`)) {
      const message: Message = {
        timeStamp: new Date().getTime(),
        joinedRoomName: this.roomeName,
        senderName: this.socketIo.userData.username,
        socketId: user.socketId,
        movieId: this.movie._id,
        recieverId: user.user_id,
      };

      this.socketIo.sendMessage('invitation', message);
      this.needInvite = false;
    }
  }

  ngOnDestroy() {
    this.webrtc.leaveRoom(this.roomeName);
    if (this.isInGroup) {
      console.log('unsubscribe');
      this.readyToCallSubscription.unsubscribe();
    }
    alert('You left the room and you automatically left the video chat');
  }
}

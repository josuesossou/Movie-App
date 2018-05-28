import { Component, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SocketIoService } from '../../services/socket-io.service';
import { WebrtcService } from '../../services/webrtc.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  private routerSubscription: Subscription;

  notification = false;
  invitations: Object[] = [];

  constructor(
    private socketIo: SocketIoService,
    private webrtc: WebrtcService,
    private router: Router,
  ) { }

  ngOnInit() {
    // if (this.router.lo)
    this.webrtc.setUpWrtc();

    const location = this.router.setUpLocationChangeListener();
    this.routerSubscription = this.router.events.subscribe((e: RouterEvent) => {
      if (e.url === '/' && e.id >= 2) {
        this.setReceiveMessage();
        console.log(true);
      }
    });
  }

  setReceiveMessage() {
    this.socketIo.receiveMessage('newInvitation').subscribe(invitation => {
      if (invitation.recieverId === this.socketIo.user._id) {
        this.invitations.push(invitation);
        this.notification = true;
      }
    });

    this.routerSubscription.unsubscribe();
  }

  joinRoom(invitation) {
    this.router.navigate([`/video/${invitation.movieId}/${invitation.joinedRoomName}`]);
    this.removeInvitation(invitation.joinedRoomName);
    this.notification = false;
  }

  removeInvitation(joinedRoomName) {
    this.invitations = this.invitations.filter((invitation: any) => {
      if (joinedRoomName !== invitation.joinedRoomNamve) {
        return invitation;
      }
    });
    console.log(this.invitations, joinedRoomName);
  }

  close() {
    this.notification = false;
  }
}

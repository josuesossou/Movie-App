import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebrtcService } from '../../services/webrtc.service'
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  isInvited:boolean = false;
  isGroup:boolean = true;
  needLive:boolean = false;
  needChat:boolean = false;
  needInvite:boolean = false;

  constructor(
    private router: Router,
    private webrtc:WebrtcService
  ) { }

  ngOnInit() {
  }
  home(){
    console.log('wier')
    this.webrtc.leaveRoom('alo');
    this.router.navigate(['/'])
  }

  show(need){
    if(need === 'needChat'){
      this.needChat = !this.needChat;
      this.needInvite = false
    }else{
      this.needInvite = !this.needInvite;
      this.needChat = false
    }
  }
}

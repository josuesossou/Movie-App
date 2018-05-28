import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-local-video',
  templateUrl: './local-video.component.html',
  styleUrls: ['./local-video.component.css']
})
export class LocalVideoComponent implements OnInit, OnDestroy {

  on = true;

  constructor(private webrtc: WebrtcService) {}

  ngOnInit() {
    this.webrtc.startLocalVideo();
  }

  resumeLocalVid() {
    this.on = true;
    this.webrtc.resumeLocalVideo();
  }

  pauseLocalVid() {
    this.on = false;
    this.webrtc.pauseLocalVideo();
  }

  ngOnDestroy() {
    this.webrtc.stopLocalVideo();
  }
}

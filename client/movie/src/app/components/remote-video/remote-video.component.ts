import { Component, OnInit } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';

@Component({
  selector: 'app-remote-video',
  templateUrl: './remote-video.component.html',
  styleUrls: ['./remote-video.component.css']
})
export class RemoteVideoComponent implements OnInit {

  video:object;

  constructor(private webrtc: WebrtcService) { }

  ngOnInit() {
    this.webrtc.onVideoAdded().subscribe(data => {
      console.log('data',data);
      this.video = data.video.src;
    });
    this.webrtc.onReadyToCall('alo').subscribe((data) => {
      // console.log('ready', data);
    });
  }

}

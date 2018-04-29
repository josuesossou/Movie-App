import { Component, OnInit } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-local-video',
  templateUrl: './local-video.component.html',
  styleUrls: ['./local-video.component.css']
})
export class LocalVideoComponent implements OnInit {

  constructor(private webrtc: WebrtcService) {

  }

  ngOnInit() {
    
  }

}

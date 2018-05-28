import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { Subscription } from 'rxjs/Subscription';
// @ts-check
@Component({
  selector: 'app-remote-video',
  templateUrl: './remote-video.component.html',
  styleUrls: ['./remote-video.component.css']
})
export class RemoteVideoComponent implements OnInit, OnDestroy {

  private videoAddedSubscription: Subscription;
  private videoRemovedSubscription: Subscription;

  @ViewChild('remoteVid')
  private remoteVid: ElementRef;

  video: object;
  videos: Object[] = [];
  id;
  isVideo = false;

  constructor(
    private webrtc: WebrtcService,
    private renderer: Renderer2,
  ) { }


  ngOnInit() {
    this.videoAddedSubscription = this.webrtc.onVideoAdded().subscribe(data => {
      console.log('video aded');
      data.video.oncontextmenu = () => false;

      this.renderer.appendChild(this.remoteVid.nativeElement, data.video);
    });

    this.videoRemovedSubscription = this.webrtc.onVideoRemoved().subscribe(data => {
      this.renderer.removeChild(this.remoteVid.nativeElement, data.video);
    });
  }

  ngOnDestroy() {
    this.videoAddedSubscription.unsubscribe();
    this.videoRemovedSubscription.unsubscribe();
  }
}

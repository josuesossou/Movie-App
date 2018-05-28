import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../services/socket-io.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  movie: Object;
  isLoaded = false;

  constructor(
    private socketIo: SocketIoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['videoId'];

    this.socketIo.getOneMovie(id).then((movie: any) => {
      movie.url_thumbnail = `url(${ movie.url_thumbnail })`;
      this.movie = movie;
      this.isLoaded = true;
    }).catch(err => {
      this.isLoaded = true;
    });
  }

  watchMovie(id) {
    this.router.navigate([`/video/${id}`]);
  }

}

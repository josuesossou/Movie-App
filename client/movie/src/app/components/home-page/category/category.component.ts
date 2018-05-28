import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SocketIoService } from '../../../services/socket-io.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Input() genre: any;

  movies: Object[];

  constructor(
    public router: Router,
    private socketIo: SocketIoService,
  ) { }

  ngOnInit() {
    console.log(this.genre.category);
    this.socketIo.getQuerriedMovies(this.genre.category).then((movies: any[]) => {
      movies.forEach(movie => {
        movie.url_thumbnail = `url(${ movie.url_thumbnail })`;
      });
      this.movies = movies;
    });
  }

  purchase(movie) {
    console.log('puchase', movie);
    this.router.navigate([`/purchase/${movie._id}`]);
  }
}

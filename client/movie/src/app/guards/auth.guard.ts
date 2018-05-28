import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SocketIoService } from '../services/socket-io.service';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(
    private socketIo: SocketIoService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.socketIo.user || !this.socketIo.userData) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
  }
}

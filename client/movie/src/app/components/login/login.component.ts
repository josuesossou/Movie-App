import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Authentication } from '../../model/authentication';
import { ApiCalls } from '../../lib/api-calls';
import { SocketIoService } from '../../services/socket-io.service';
import { UserData } from '../../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;

  login = true;
  resetPassword = false;
  loader = false;

  constructor(
    private router: Router,
    private api: ApiCalls,
    private socketIo: SocketIoService
  ) { }

  ngOnInit() {
  }

  onSubmit({value, valid}: {value: Authentication, valid: boolean}) {
    this.loader = true;

    if (!valid) {
      this.loader = false;
      return this.socketIo.generateFlashMessage('Enter your user name and password', 'alert-danger', 3000);
    }
    if (this.resetPassword && value.password !== value.rePassword) {
      this.loader = false;
      return this.socketIo.generateFlashMessage('Passwords do not match', 'alert-danger', 3000);
    }

    if (this.login) {
      const url = 'http://localhost:3000/login';

      this.authSubscription = this.api.authReq(value, url, 'post').subscribe((res) => {
        const xauth = res.headers.get('x-auth');
        this.socketIo.user = res.body;
        this.api.updateHeaderOpt(xauth);

        const secUrl = `http://localhost:3000/users-data/${this.socketIo.user._id}`;

        this.api.sendApiReq(null, secUrl, 'get').then((resp: UserData) => {
          this.socketIo.userData = resp;

          this.socketIo.generateFlashMessage('You have successfully logged in', 'alert-success', 3000);
          this.loader = false;
          this.socketIo.socketConnection();
          this.router.navigate(['/']);
        });
      },
      err => {
        this.loader = false;
        this.socketIo.generateFlashMessage(err.error, 'alert-danger', 3000);
      });
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

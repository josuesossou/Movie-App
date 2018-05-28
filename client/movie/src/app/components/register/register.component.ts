import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Authentication } from '../../model/authentication';
import { ApiCalls } from '../../lib/api-calls';
import { SocketIoService } from '../../services/socket-io.service';
import { UserData } from '../../model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
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
      return this.socketIo.generateFlashMessage('Enter username and password', 'alert-danger', 3000);
    }
    if (value.password !== value.rePassword) {
      this.loader = false;
      return this.socketIo.generateFlashMessage('Passwords do not match', 'alert-danger', 3000);
    }
    this.sendreq(value);
  }

  sendreq(value) {
    const url = 'http://localhost:3000/register';

    this.authSubscription = this.api.authReq(value, url, 'post').subscribe((res) => {
      const xauth = res.headers.get('x-auth');
      this.socketIo.user = res.body;
      this.api.updateHeaderOpt(xauth);

      const secUrl = 'http://localhost:3000/users-data';

      this.api.sendApiReq({}, secUrl, 'post').then((resp: UserData) => {
        this.socketIo.userData = resp;
        this.socketIo.generateFlashMessage('You have successfully Registered', 'alert-success', 3000);
        this.loader = true;
        this.socketIo.socketConnection();
        this.router.navigate(['/']);
      });
    },
    err => {
      this.socketIo.generateFlashMessage(err.error, 'alert-danger', 3000);
      this.loader = false;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

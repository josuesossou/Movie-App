import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User, UserData } from '../model/user';


@Injectable()
export class ApiCalls {
  constructor(
    private http: HttpClient,
  ) {}

  headerOptions = {
    body: null,
    headers: new HttpHeaders()
  };

  sendApiReq(data, url, method) {
    if (data) {
      this.headerOptions.body = data;
    }

    return this.http.request(
      method,
      url,
      this.headerOptions,
    ).toPromise().then(response => {
      if (!response) {
        return Promise.reject('no response');
      }
      return Promise.resolve(response);
    }).catch(e => {
      return Promise.reject(e);
    });
  }

  authReq(data, url, method) {
    return this.http.request(method, url, { observe: 'response', body: data });
  }

  updateHeaderOpt(xauth) {
    this.headerOptions.headers = new HttpHeaders({
      'x-auth': xauth,
      'Content-Type': 'application/json'
    });
  }

}

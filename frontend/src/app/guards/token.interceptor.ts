import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check for url. If it is login url then return
    if (request.url.includes('login') || request.url.includes('signup')) {
      console.log(request.url);
      return next.handle(request);
    }

    // Used to send Token for every HTTP request being made
    if (localStorage.getItem('user')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('user')).token
          }`,
        },
      });
    }
    return next.handle(request);
  }
}

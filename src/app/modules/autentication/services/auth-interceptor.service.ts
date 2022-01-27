import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService:   AuthService,
    private configService: ConfigService,
    private router:        Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const token: string = this.authService.getToken();
    let config:any = this.configService;

    let request = req;

    if (token && request.url != (config.apiBaseUrl + config.loginAction) ) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }

        return throwError( err );

      })
    );
  }

}



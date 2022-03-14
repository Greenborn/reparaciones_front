import { Injectable }              from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }                  from '@angular/router';
import { Subject }                 from 'rxjs';

import { Login }           from '../models/login';
import { ResetPassword }   from '../models/reset-password';
import { Usuario }         from '../models/usuario';

import { ConfigService }   from 'src/app/services/config.service';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private confGral:any = {};
  private LastElement:any = {};

  constructor(
    private  router:            Router,
    private  http:              HttpClient,
    private  config:            ConfigService,

    private appUIUtilsService:   AppUIUtilsService, 
  ) {
    this.confGral = this.config.data;
  }

  async login( model:Login ){
    this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });

    this.http.post(this.confGral['apiBaseUrl'] + this.confGral['loginAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
        data => {
            this.appUIUtilsService.dissmisLoading();

            if ( (data as any).hasOwnProperty("token") ){
                localStorage.setItem( this.confGral['appName']+'token', (data as any).token );
                localStorage.setItem( this.confGral['appName']+'logedIn', JSON.stringify( true ) );
                this.router.navigate([ this.confGral.postLoginRoute ]);
            } else {
                this.appUIUtilsService.displayAlert('Usuario o contraseña incorrecta.', 'Atención', [
                    { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
                ]);
            }
        },
        err =>  {
            this.appUIUtilsService.dissmisLoading();
            localStorage.setItem( this.confGral['appName']+'logedIn',      JSON.stringify( false ) );
            localStorage.setItem( this.confGral['appName']+'token',        JSON.stringify( '' ) );
            this.appUIUtilsService.displayAlert('Usuario o contraseña incorrecta.', 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
        }
      );
  }

  toLoginIfNL(){
    if ( !this.logedIn() ){
      this.router.navigate(['/login']);
    } 
  }

  toLogOut(){
    localStorage.setItem( this.confGral['appName']+'logedIn',  JSON.stringify( false ) );
    localStorage.setItem( this.confGral['appName']+'token',    '' );
    this.router.navigate(['/login']);
  }

  logedIn(){
    let lgIn:any = localStorage.getItem( this.confGral['appName']+'logedIn' );
    if ( lgIn === undefined || lgIn === null ){
      return false;
    }
    return (lgIn === "true");
  }

  getToken(){
    return localStorage.getItem( this.confGral['appName']+'token' );
  }

  getUserName(){
    let out:any = localStorage.getItem( this.confGral['appName']+'userName' );
    //se eliminan las dos comillas
    out = out.replace('"','');
    out = out.replace('"','');
    out = out.replace(/\w\S*/g, (w:any) => (w.replace(/^\w/, (c:any) => c.toUpperCase())));
    return out;
  }

}

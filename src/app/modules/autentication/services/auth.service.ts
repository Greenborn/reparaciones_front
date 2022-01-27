import { Injectable }              from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }                  from '@angular/router';
import { Subject }                 from 'rxjs';

import { Login }           from '../models/login';
import { ResetPassword }   from '../models/reset-password';
import { Usuario }         from '../models/usuario';

import { ConfigService }   from 'src/app/services/config.service';
import { AlertController, LoadingController } from '@ionic/angular';

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
    private  loadingController: LoadingController,
    private  alertCtrl:         AlertController,
  ) {
    this.confGral = this.config.data;
  }

  async login( model:Login ){
    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    this.http.post(this.confGral['apiBaseUrl'] + this.confGral['loginAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
        data => {
          loading.dismiss();

          if ( (data as any).hasOwnProperty("token") ){
            localStorage.setItem( this.confGral['appName']+'token', (data as any).token );
            localStorage.setItem( this.confGral['appName']+'logedIn', JSON.stringify( true ) );
            this.router.navigate([ this.confGral.postLoginRoute ]);
          } else {
            this.displayAlert( 'Usuario o contraseña incorrecta.' );
          }
        },
        err =>  {
          loading.dismiss();
          localStorage.setItem( this.confGral['appName']+'logedIn',      JSON.stringify( false ) );
          localStorage.setItem( this.confGral['appName']+'token',        JSON.stringify( '' ) );
          this.displayAlert( 'Usuario o contraseña incorrecta.' );
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

  async displayAlert(message: string) {
    // this.alertCtrl.dismiss();
    (await this.alertCtrl.create({
      header: 'Info',
      message,
      buttons: [{
        text: 'Ok',
        role: 'cancel'
      }]
    })).present()
  }

}

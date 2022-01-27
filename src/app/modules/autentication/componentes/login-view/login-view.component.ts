import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';

import { Login }         from '../../models/login';

import { AuthService }     from '../../services/auth.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent extends ApiConsumer {

  public login:Login = new Login();

  constructor(
    private auth:               AuthService,
    private router:             Router,
    public  loadingController:  LoadingController,
    private alertController:    AlertController
  ) { 
    super(alertController, loadingController);
  }

  ngOnInit(): void {
  }

  async next(){
    if (this.login.password == ''){
      super.displayAlert('Debe ingresar una contraseña.');
      return false;
    }

    if (this.login.username == ''){
      super.displayAlert('Debe ingresar un nombre de usuario.');
      return false;
    }

    this.auth.login( this.login );
  }

  keyPress( e, input ){
    
  }

}

import { Component } from '@angular/core';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';

import { Login }         from '../../models/login';

import { AuthService }     from '../../services/auth.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent {

  public login:Login = new Login();

  constructor(
    private auth:               AuthService,
    private appUIUtilsService:  AppUIUtilsService, 
  ) {
  }

  ngOnInit(): void {
  }

  async next(){
    if (this.login.password == ''){
        this.appUIUtilsService.displayAlert('Debe ingresar una contraseña.', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    if (this.login.username == ''){
        this.appUIUtilsService.displayAlert('Debe ingresar un nombre de usuario.', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    this.auth.login( this.login );
  }

  keyPress( e, input ){
    
  }

}

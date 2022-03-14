import { Component, Input, OnInit } from '@angular/core';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { ChangePassword } from '../../models/change-password';
import { ChangePasswordService } from '../../services/change.password.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
})
export class ChangePassComponent implements OnInit {

  @Input() modal: any;

  constructor(
    private changePasswordService: ChangePasswordService,

    private appUIUtilsService:   AppUIUtilsService, 
  ) {
  }

  public model:ChangePassword = new ChangePassword();

  ngOnInit() {}

  async ingresar(){
    if (this.model.new_password == ''){
        this.appUIUtilsService.displayAlert('Debe ingresar una nueva contraseña.', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    if (this.model.old_password == ''){
        this.appUIUtilsService.displayAlert('Debe ingresar la contraseña actual.', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    if (this.model.repeat_password == ''){
        this.appUIUtilsService.displayAlert('Debe ingresar la contraseña en el campo "repetir contraseña".', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    if (this.model.repeat_password !== this.model.new_password){
        this.appUIUtilsService.displayAlert('Las contraseñas no coinciden.', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
    
    this.changePasswordService.put(this.model, 0).subscribe(
      ok => {
        this.appUIUtilsService.dissmisLoading();
        if (ok['status'] == true){
            this.appUIUtilsService.displayAlert("Se ha modificado la contraseña.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.volver();
            return true;
        }
        
        this.appUIUtilsService.displayAlert(ok['message'], 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
      },
      err => {
        this.appUIUtilsService.displayAlert("Ocurrió un error.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        this.appUIUtilsService.dissmisLoading();
      }
    );
  }

  volver(){
    this.modal.dismiss();
  }
}

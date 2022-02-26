import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { ChangePassword } from '../../models/change-password';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordService } from '../../services/change.password.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
})
export class ChangePassComponent extends ApiConsumer implements OnInit {

  @Input() modal: any;

  constructor(
    private changePasswordService: ChangePasswordService,
    public  loadingController:     LoadingController,
    private alertController:       AlertController,
    public changeDetectorRef:      ChangeDetectorRef,
    private auth:                  AuthService,
  ) { 
    super(alertController, loadingController, changeDetectorRef, auth);
  }

  public model:ChangePassword = new ChangePassword();

  ngOnInit() {}

  async ingresar(){
    if (this.model.new_password == ''){
      super.displayAlert('Debe ingresar una nueva contraseña.');
      return false;
    }

    if (this.model.old_password == ''){
      super.displayAlert('Debe ingresar la contraseña actual.');
      return false;
    }

    if (this.model.repeat_password == ''){
      super.displayAlert('Debe ingresar la contraseña en el campo "repetir contraseña".');
      return false;
    }

    if (this.model.repeat_password !== this.model.new_password){
      super.displayAlert('Las contraseñas no coinciden.');
      return false;
    }

    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    this.changePasswordService.put(this.model, 0).subscribe(
      ok => {
        loading.dismiss();
        if (ok['status'] == true){
          super.displayAlert("Se ha modificado la contraseña.");
          this.volver();
          return true;
        }
        
        super.displayAlert(ok['message']);
      },
      err => {
        super.displayAlert("Ocurrió un error.");
        loading.dismiss();
      }
    );
  }

  volver(){
    this.modal.dismiss();
  }
}

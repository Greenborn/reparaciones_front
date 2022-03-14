import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateTipoNotaService2 } from 'src/app/services/private.tipo.nota.service2';

@Component({
  selector: 'app-tiponota-form',
  templateUrl: './tiponota.form.component.html',
  styleUrls: ['./tiponota.form.component.scss'],
})
export class TiponotaFormComponent implements OnInit, OnDestroy {

  constructor(
    public privateTipoNotaService:  PrivateTipoNotaService2,

    private appUIUtilsService:        AppUIUtilsService, 
    private navController:            NavController
  ) {
  }

    ngOnDestroy(){}

    ngOnInit() {

    }

    goBack(){
        this.navController.setDirection('back');
    }

    async ingresar(){

        let validacionResult = this.privateTipoNotaService.modelo_edit.datosValidos(); 

        if ( !validacionResult.success ){
            this.appUIUtilsService.displayAlert(validacionResult.msg, 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            return false;
        }

        this.privateTipoNotaService.guardar_modelo();
    }
}

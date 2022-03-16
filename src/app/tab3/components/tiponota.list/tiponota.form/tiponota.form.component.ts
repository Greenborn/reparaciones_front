import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateTipoNotaService2 } from 'src/app/services/private.tipo.nota.service2';

@Component({
  selector: 'app-tiponota-form',
  templateUrl: './tiponota.form.component.html',
  styleUrls: ['./tiponota.form.component.scss'],
})
export class TiponotaFormComponent implements OnInit, OnDestroy {

    private subcripciones:any = [];

    constructor(
        public privateTipoNotaService:  PrivateTipoNotaService2,

        private appUIUtilsService:        AppUIUtilsService, 
        private navController:            NavController,
        private activatedRoute:           ActivatedRoute
    ) {
    }

    ngOnDestroy(){
        for (let c=0; c < this.subcripciones.length; c++){
            this.subcripciones[c].unsubscribe();
        }
    }

    ngOnInit() {
        this.subcripciones.push(
            this.activatedRoute.paramMap.subscribe(async params => { 
                //Si se trata de una nota nueva a la cual se le especifica id de tipo de nota
                let id_tipo_nota:any = params.get('id_tipo_nota');
                if (id_tipo_nota !== null){
                    this.privateTipoNotaService.get( Number(id_tipo_nota) );
                }
            })
        );
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

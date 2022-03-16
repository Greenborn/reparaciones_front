import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Estado } from 'src/app/models/estado';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateEstadoService2 } from 'src/app/services/private.estado.service2';

@Component({
  selector: 'app-estados.form',
  templateUrl: './estados.form.component.html',
  styleUrls: ['./estados.form.component.scss'],
})
export class EstadosFormComponent implements OnInit, OnDestroy {

  private subscripciones:any = [];

  constructor(
    private activatedRoute:              ActivatedRoute, 
    public  privateEstadoService:        PrivateEstadoService2,
    private appUIUtilsService:           AppUIUtilsService, 

    private navController: NavController
  ) { 
  }

    ngOnInit() {
        this.subscripciones.push(
            this.activatedRoute.paramMap.subscribe(async params => { 
                //Si se trata de la edicion de un estado
                let id_estado = params.get('id_estado');
                if (id_estado !== null){
                    this.privateEstadoService.operacion_actual = 'Editar';
                    this.privateEstadoService.get( Number(id_estado) );
                }
            })
        );

    }

    ngOnDestroy(){
        for (let c=0; c < this.subscripciones.length; c++){
            this.subscripciones[c].unsubscribe();
        }
    }
  
    goBack(){
        this.navController.pop();
    }

    async ingresar(){
        let validacionResult = this.privateEstadoService.modelo_edit.datosValidos(); 

        if ( !validacionResult.success ){
            this.appUIUtilsService.displayAlert(validacionResult.msg, 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            return false;
        }
        
        this.privateEstadoService.guardar_modelo();
    }

}

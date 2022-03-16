import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Estado } from 'src/app/models/estado';

import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateCategoriaService2 } from 'src/app/services/private.categoria.service2';
import { PrivateEstadoService2 } from 'src/app/services/private.estado.service2';

@Component({
  selector: 'app-categorias.form',
  templateUrl: './categorias.form.component.html',
  styleUrls: ['./categorias.form.component.scss'],
})
export class CategoriasFormComponent  implements OnInit, OnDestroy {

    private subcripciones:any = [];

    constructor(
        private navController:               NavController,
        public  privateCategoriaService:     PrivateCategoriaService2,
        public  privateEstadoService:        PrivateEstadoService2,

        private activatedRoute:              ActivatedRoute,
        private appUIUtilsService:           AppUIUtilsService,
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
                //Si se trata de la edición de una categoría
                let id_categoria:any = params.get('id_categoria');
                if (id_categoria !== null){
                    this.privateCategoriaService.operacion_actual = 'Editar';
                    this.privateCategoriaService.get( Number(id_categoria), 'expand=estados' );
                }
            })
        );
    }

  
    goBack(){
        this.navController.navigateForward([ '/tabs/tab3' ]);
    }

    nuevo_estado(){
        this.privateEstadoService.goToCreate( { categoria_id: this.privateCategoriaService.modelo_edit.id } );
    }
    
    editar_estado( estado:Estado ){
        this.privateEstadoService.goToEdit( { estado_id: estado.id } );
    }

    async eliminar_estado( estado:Estado ){
        this.appUIUtilsService.displayAlert('Está por eliminar el estado "' + estado.nombre + '" ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_estado(estado); } }
        ]);
    }

    async borrar_estado( estado:Estado ){
        this.appUIUtilsService.presentLoading({ message: 'Borrando estado: ' + estado.nombre });
        this.privateEstadoService.delete( estado.id );
    }

    async ingresar(){
        let validacionResult = this.privateCategoriaService.modelo_edit.datosValidos(); 

        if ( !validacionResult.success ){
            this.appUIUtilsService.displayAlert(validacionResult.msg, 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            return false;
        }
        
        this.privateCategoriaService.guardar_modelo();
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Nota } from 'src/app/models/nota';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';
import { PrivateTipoNotaService } from 'src/app/services/private.tipo.nota.service';
import { FiltroNotas } from './models/filtro.notas';

@Component({
  selector: 'app-vista-notas',
  templateUrl: './vista.notas.component.html',
  styleUrls: ['./vista.notas.component.scss'],
})
export class VistaNotasComponent  implements OnInit, OnDestroy  {

  public titulo:string = "";

  private subscripciones:any = [];

  public tipo_nota_id:any = -1;
  

    constructor(
        private activatedRoute:              ActivatedRoute,
        public  privateNotaService:          PrivateNotaService,
        public  privateTipoNotaService:      PrivateTipoNotaService,
        public  privateEstadoService:        PrivateEstadoService,
        public  privateObrasService:         PrivateObrasService,
        public  privateCategoriaService:     PrivateCategoriaService,
        private appUIUtilsService:           AppUIUtilsService,
        private navController:               NavController
    ) {
    }
    public filtros:FiltroNotas = new FiltroNotas();

    ngOnInit() {
        //Se INICIALIZAN LOS FILTROS
        this.filtros.setNotaService( this.privateNotaService );
        this.filtros.setEstadoService( this.privateEstadoService );
        this.filtros.setAppUIUtilsService( this.appUIUtilsService );

        //SE VERIFICAN LOS PARAMETROS EN LA URL
        this.subscripciones.push( this.activatedRoute.paramMap.subscribe(async params => 
            { 
                let id_obra:any           = params.get('id_obra');
                let get_notas_params:any  = { getParams:   'expand=categoria,obra,tipoNota' };
                
                if (id_obra !== null){
                    get_notas_params.obra_id = id_obra;
                }

                //SE RECARGA EL LISTADO DE NOTAS
                this.privateNotaService.getNotas( get_notas_params );

                //NOS ASEGURAMOS DE CARGAR EL LISTADO DE OBRAS
                //SOLO LAS QUE ESTAN HABILITADAS
                this.appUIUtilsService.presentLoading({ message: 'Consultando listado de obras...' });
                this.privateObrasService.getAll({
                    getParams: 'filter[habilitada]=1',
                    callback: ()=>{
                        this.appUIUtilsService.dissmisLoading();
                    }
                });

                this.filtros.clear_all();
            })
        );

        //SE CARGA EL LISTADO DE TIPOS DE NOTAS 
        if (this.privateTipoNotaService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: 'Consultando listado de tipos de notas...' });
            this.privateTipoNotaService.getAll();
        }

        //SE CARGA EL LISTADO DE CATEGORIAS
        if (this.privateCategoriaService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: 'Consultando listado de categorías...' });
            this.privateCategoriaService.getAll();
        }
    }

    ngOnDestroy(){
        //Nos desubscribimos de todas las subcripciones vigentes
        for (let c=0; c < this.subscripciones.length; c++){
            this.subscripciones[c].unsubscribe();
        }
    }

    getBgColor(nota:any){
        if (!nota.hasOwnProperty('categoria')){
            return '#FFF';
        }
        if (!nota.categoria.hasOwnProperty('color')){
            return '#FFF';
        }
        return nota.categoria.color;
    }

    nombreObra(nota){
        if (!nota.hasOwnProperty('obra')){
            return '';
        }
        return nota.obra.nombre_alias;
    }
  
    goBack(){
        this.navController.back();
    }

    editar_nota(nota){
        this.privateNotaService.goToEdit({ nota_id:nota.id, navigationOrigin:'/tabs/tab2' });
    }

    nueva_nota(){
        this.privateNotaService.goToNueva({ navigationOrigin:'/tabs/tab2' });
    }

    async eliminar_nota( nota:Nota ){
        this.appUIUtilsService.displayAlert('Está por eliminar la nota "' + nota.nota + '" y se perderán sus archivos asociados ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_nota(nota); } }
        ]);
    }

    async borrar_nota( nota:Nota ){
        this.appUIUtilsService.presentLoading({ message: 'Borrando nota: ' + nota.nota });
        this.privateNotaService.delete( nota.id );
    }
}

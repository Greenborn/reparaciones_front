import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TipoNota } from 'src/app/models/tipo.nota';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateTipoNotaService2 } from 'src/app/services/private.tipo.nota.service2';

@Component({
  selector: 'app-tiponota-list',
  templateUrl: './tiponota.list.component.html',
  styleUrls: ['./tiponota.list.component.scss'],
})
export class TiponotaListComponent implements OnInit, OnDestroy {

    constructor(
        public privateTipoNotaService:    PrivateTipoNotaService2,
        private appUIUtilsService:        AppUIUtilsService, 
    ) {
    }
  
    ngOnInit() {
        this.load_data();
    }

    ngOnDestroy(){

    }

    load_data(){
        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de tipos de notas...' });
        this.privateTipoNotaService.getAll(); 
    }
  
    nuevo_tipo_nota(){
        this.privateTipoNotaService.goToNueva();
    }

    editar_tipo_nota( tipo_nota:TipoNota ){
        this.privateTipoNotaService.goToEdit( tipo_nota.id );
    }

    async eliminar_tipo_nota( tipo_nota:TipoNota ){
        this.appUIUtilsService.displayAlert('Está por eliminar el tipo de nota "' + tipo_nota.nombre + '" ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_tipo_nota(tipo_nota); } }
        ]);
    }

    async borrar_tipo_nota( tipo_nota:TipoNota ){
        this.appUIUtilsService.presentLoading({ message: 'Borrando tipo de nota: ' + tipo_nota.nombre });
        this.privateTipoNotaService.delete( tipo_nota.id );
    }

}

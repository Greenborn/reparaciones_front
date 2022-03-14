import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateTipoNotaService } from 'src/app/services/private.tipo.nota.service';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-tiponota-list',
  templateUrl: './tiponota.list.component.html',
  styleUrls: ['./tiponota.list.component.scss'],
})
export class TiponotaListComponent implements OnInit, OnDestroy {

  public tipo_notas:any = [];

  constructor(
    private privateTipoNotaService:   PrivateTipoNotaService,
    private router:                   Router,
    private tab3Service:              Tab3Service,

    private appUIUtilsService:        AppUIUtilsService, 
  ) {
  }
  
  ngOnInit() {
    this.load_data();
  }

  ngOnDestroy(){

  }

  load_data(){
    //this.loadingEspecificData(this.privateTipoNotaService, '',   'tipo_notas', 'Consultando tipos de notas.');
  }
  
  nuevo_tipo_nota(){
    this.router.navigate([ '/tabs/tab3/crear_tipo_nota' ]);
  }

  editar_tipo_nota(tipo_nota){
    this.tab3Service.tipo_nota_edit_id = tipo_nota.id;
    this.router.navigate([ '/tabs/tab3/editar_tipo_nota' ]);
  }

    async eliminar_tipo_nota(tipo_nota){
        this.appUIUtilsService.displayAlert('Está por eliminar el tipo de nota "' + tipo_nota.nombre + '" ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_tipo_nota(tipo_nota); } }
        ]);
    }

  async borrar_tipo_nota(tipo_nota){
    this.appUIUtilsService.presentLoading({ message: 'Borrando tipo de nota: ' + tipo_nota.nombre });
    this.privateTipoNotaService.delete(tipo_nota.id).subscribe(
      ok => {
        this.appUIUtilsService.dissmisLoading();
        this.load_data();
      },
      err => {
        this.appUIUtilsService.dissmisLoading();
        this.appUIUtilsService.displayAlert('Ocurrió un error al intentar eliminar la nota. ', 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
      }
    );
  }

}

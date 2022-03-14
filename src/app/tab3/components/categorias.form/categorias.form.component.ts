import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Categoria } from 'src/app/models/categoria';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateCategoriaService2 } from 'src/app/services/private.categoria.service2';
import { PrivateEstadoService2 } from 'src/app/services/private.estado.service2';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-categorias.form',
  templateUrl: './categorias.form.component.html',
  styleUrls: ['./categorias.form.component.scss'],
})
export class CategoriasFormComponent  implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Categoria    = new Categoria();
  public estados:any;

  private router_subs:any;
  private recargarEstadosSubs:any;

  constructor(
    private navController:               NavController,
    private router:                      Router,
    private privateCategoriaService:     PrivateCategoriaService2,
    private privateEstadoService:        PrivateEstadoService2,
    private tab3Service:                 Tab3Service,

    private appUIUtilsService:           AppUIUtilsService,
  ) {  
  }

    ngOnDestroy(){

    }

    ngOnInit() { 

    }

  
  goBack(){
    this.navController.navigateForward([ '/tabs/tab3' ]);
  }

  nuevo_estado(){
    this.tab3Service.estado_categoria_id = this.model.id;
    this.navController.navigateForward([ '/tabs/tab3/crear_estado' ]);
  }

  editar_estado(estado){
    this.tab3Service.estado_edit_id = estado.id;
    this.navController.navigateForward([ '/tabs/tab3/editar_estado' ]);
  }

    async eliminar_estado(estado){
        this.appUIUtilsService.displayAlert('Está por eliminar el estado "' + estado.nombre + '" ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_estado(estado); } }
        ]);
    }

  async borrar_estado(estado){
    this.appUIUtilsService.presentLoading({ message: 'Borrando estado: ' + estado.nombre });
    /*
    this.privateEstadoService.delete(estado.id).subscribe(
      ok => {
            this.appUIUtilsService.dissmisLoading();
            this.tab3Service.recargarEstado.next({id: estado.categoria_id});
      },
      err => {
        this.appUIUtilsService.dissmisLoading();
        this.appUIUtilsService.displayAlert('Ocurrió un error al intentar eliminar el estado: ' + estado.nombre + '¿El estado tiene notas asociadas?', 'Error', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
      }
    );*/
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('color') || this.model.color == ''){
        this.appUIUtilsService.displayAlert("Debe definir un color para la categoría.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    if ( !this.model.hasOwnProperty('nombre') || this.model.nombre == ''){
        this.appUIUtilsService.displayAlert("Debe definir un nombre para la categoría.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }
    
    this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
    
  }
}

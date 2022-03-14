import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Categoria } from 'src/app/models/categoria';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
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
    private router:                      Router,
    private privateCategoriaService:     PrivateCategoriaService,
    private privateEstadoService:        PrivateEstadoService,
    private tab3Service:                 Tab3Service,

    private appUIUtilsService:           AppUIUtilsService,
  ) {  
  }

  ngOnDestroy(){}

  ngOnInit() {
    if (this.recargarEstadosSubs == undefined){
      this.recargarEstadosSubs = this.tab3Service.recargarEstado.subscribe({ next:(data:any) => {
        //this.loadingEspecificData(this.privateEstadoService, 'filter[categoria_id]='+data.id,   'estados', 'Consultando estados.');
      }});
    }
    
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_categoria') != -1) {
          this.accion = 'Nueva';
        } else if (event.url.search('editar_categoria') != -1){
          this.accion = 'Editar';
          
          this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
          this.privateCategoriaService.get(this.tab3Service.categoria_edit_id).subscribe(
            ok => {
                this.appUIUtilsService.dissmisLoading();
                this.model = ok;
                this.tab3Service.recargarEstado.next(this.model);
            },
            err => {
                this.appUIUtilsService.dissmisLoading();
            }
          );
  
        }
      });
    }
    
  }

  OnDestroy(){
    this.router_subs.unsubscribe();
    this.recargarEstadosSubs.unsubscribe();
  }
  
  goBack(){
    this.router.navigate([ '/tabs/tab3' ]);
  }

  nuevo_estado(){
    this.tab3Service.estado_categoria_id = this.model.id;
    this.router.navigate([ '/tabs/tab3/crear_estado' ]);
  }

  editar_estado(estado){
    this.tab3Service.estado_edit_id = estado.id;
    this.router.navigate([ '/tabs/tab3/editar_estado' ]);
  }

    async eliminar_estado(estado){
        this.appUIUtilsService.displayAlert('Está por eliminar el estado "' + estado.nombre + '" ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_estado(estado); } }
        ]);
    }

  async borrar_estado(estado){
    this.appUIUtilsService.presentLoading({ message: 'Borrando estado: ' + estado.nombre });
    
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
    );
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
    if (this.accion == 'Nueva'){
      this.privateCategoriaService.post(this.model).subscribe(
        ok => {
            this.appUIUtilsService.displayAlert("Nuevo registro de Categoría creado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.tab3Service.recargarCategoria.next();
            this.goBack();
        },
        err => {
            this.appUIUtilsService.dissmisLoading();
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateCategoriaService.put(this.model, this.model.id).subscribe(
        ok => {
            this.appUIUtilsService.displayAlert("Se ha modificado la categoría.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.tab3Service.recargarCategoria.next();
            this.goBack();
        },
        err => {
            this.appUIUtilsService.dissmisLoading();
        }
      );
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TipoNota } from 'src/app/models/tipo.nota';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateTipoNotaService } from 'src/app/services/private.tipo.nota.service';
import { Tab3Service } from 'src/app/tab3/services/tab3.service';

@Component({
  selector: 'app-tiponota-form',
  templateUrl: './tiponota.form.component.html',
  styleUrls: ['./tiponota.form.component.scss'],
})
export class TiponotaFormComponent implements OnInit, OnDestroy {

  public accion:string = 'Nuevo';
  public model:TipoNota = new TipoNota();

  private router_subs:any;

  constructor(
    private router:                   Router,
    private privateTipoNotaService:   PrivateTipoNotaService,
    private tab3Service:              Tab3Service,

    private appUIUtilsService:           AppUIUtilsService, 
  ) {
  }

  ngOnDestroy(){}

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_tipo_nota') != -1) {
          this.accion = 'Nuevo';
        } else if (event.url.search('editar_tipo_nota') != -1){
          this.accion = 'Editar';
          
          this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
          this.privateTipoNotaService.get(this.tab3Service.tipo_nota_edit_id).subscribe(
            ok => {
                this.appUIUtilsService.dissmisLoading();
                this.model = ok;
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
  }

  goBack(){
    this.router.navigate([ '/tabs/tab3' ]);
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('color') || this.model.color == ''){
        this.appUIUtilsService.displayAlert("Debe definir un color para el tipo de nota.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    if ( !this.model.hasOwnProperty('nombre') || this.model.nombre == ''){
        this.appUIUtilsService.displayAlert("Debe definir un nombre para tipo de nota.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
    if (this.accion == 'Nuevo'){
      this.privateTipoNotaService.post(this.model).subscribe(
        ok => {
            this.appUIUtilsService.displayAlert("Nuevo registro de Tipo de Nota creado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading(); 
            this.tab3Service.recargarTipoNota.next();
            this.goBack();
        },
        err => {
            this.appUIUtilsService.dissmisLoading(); 
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateTipoNotaService.put(this.model, this.model.id).subscribe(
        ok => {
            this.appUIUtilsService.displayAlert("Se ha modificado el Tipo de Nota.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading(); 
            this.tab3Service.recargarTipoNota.next();
            this.goBack();
        },
        err => {
            this.appUIUtilsService.dissmisLoading(); 
        }
      );
    }
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Estado } from 'src/app/models/estado';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-estados.form',
  templateUrl: './estados.form.component.html',
  styleUrls: ['./estados.form.component.scss'],
})
export class EstadosFormComponent implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Estado    = new Estado();

  private router_subs:any;

  constructor(
    private tab3Service:                 Tab3Service,
    private router:                      Router, 
    private privateEstadoService:        PrivateEstadoService,
    private appUIUtilsService:           AppUIUtilsService, 
  ) { 
  }

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_estado') != -1) {
          this.accion = 'Nuevo';
          this.model.categoria_id = this.tab3Service.estado_categoria_id;
        } else if (event.url.search('editar_estado') != -1){
          this.accion = 'Editar';
          
          this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
          this.privateEstadoService.get(this.tab3Service.estado_edit_id).subscribe(
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

  ngOnDestroy(){
    this.router_subs.unsubscribe();
  }
  
  goBack(){
    this.router.navigate([ '/tabs/tab3/editar_categoria' ]);
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('nombre') || this.model.nombre == ''){
        this.appUIUtilsService.displayAlert("Debe definir un nombre para el estado.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        return false;
    }

    this.appUIUtilsService.presentLoading({ message: "Por favor espere..." });
    if (this.accion == 'Nuevo'){
      this.privateEstadoService.post(this.model).subscribe(
        ok => {
            this.appUIUtilsService.displayAlert("Nuevo registro de Estado creado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.tab3Service.recargarEstado.next(this.model.categoria_id);
            this.goBack();
        },
        err => {
            this.appUIUtilsService.dissmisLoading();
        }
      );
    }  else if (this.accion == 'Editar'){
      this.privateEstadoService.put(this.model, this.model.id).subscribe(
        ok => {
            this.appUIUtilsService.displayAlert("Se ha modificado el Estado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.tab3Service.recargarEstado.next(this.model.categoria_id);
            this.goBack();
        },
        err => {
            this.appUIUtilsService.dissmisLoading();
        }
      );
    }
  }

}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Categoria } from 'src/app/models/categoria';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-categorias.form',
  templateUrl: './categorias.form.component.html',
  styleUrls: ['./categorias.form.component.scss'],
})
export class CategoriasFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Categoria    = new Categoria();
  public estados:any;

  private router_subs:any;
  private recargarEstadosSubs:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    private privateCategoriaService:     PrivateCategoriaService,
    private privateEstadoService:        PrivateEstadoService,
    private tab3Service:                 Tab3Service,
    public  authService:                 AuthService,
  ) {  
    super(alertController, loadingController, ref, authService);
  }

  ngOnInit() {
    if (this.recargarEstadosSubs == undefined){
      this.recargarEstadosSubs = this.tab3Service.recargarEstado.subscribe({ next:(data:any) => {
        this.loadingEspecificData(this.privateEstadoService, 'filter[categoria_id]='+data.id,   'estados', 'Consultando estados.');
      }});
    }
    
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_categoria') != -1) {
          this.accion = 'Nueva';
        } else if (event.url.search('editar_categoria') != -1){
          this.accion = 'Editar';
          
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          this.privateCategoriaService.get(this.tab3Service.categoria_edit_id).subscribe(
            ok => {
              loading.dismiss();
              this.model = ok;
              this.tab3Service.recargarEstado.next(this.model);
            },
            err => {
              loading.dismiss();
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
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Está por eliminar el estado "' + estado.nombre + '" ¿desea continuar?.',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      }, {
        text: 'Si',
        cssClass: 'danger',
        handler: () => {
          this.borrar_estado(estado);
        }
      }]
    });
    await alert.present();
  }

  async borrar_estado(estado){
    const loading = await this.loadingController.create({ message: 'Borrando estado: ' + estado.nombre});
    await loading.present();
    this.privateEstadoService.delete(estado.id).subscribe(
      ok => {
        loading.dismiss();console.log(estado);
        this.tab3Service.recargarEstado.next({id: estado.categoria_id});
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar eliminar el estado: ' + estado.nombre + '¿El estado tiene notas asociadas?');
      }
    );
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('color') || this.model.color == ''){
      super.displayAlert("Debe definir un color para la categoría."); return false;
    }

    if ( !this.model.hasOwnProperty('nombre') || this.model.nombre == ''){
      super.displayAlert("Debe definir un nombre para la categoría."); return false;
    }
    
    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    if (this.accion == 'Nueva'){
      this.privateCategoriaService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Categoría creado.");
          loading.dismiss();
          this.tab3Service.recargarCategoria.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateCategoriaService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado la categoría.");
          loading.dismiss();
          this.tab3Service.recargarCategoria.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    }
  }
}

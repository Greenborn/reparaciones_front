import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Nota } from 'src/app/models/nota';
import { FormateoService } from 'src/app/services/formateo.service';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';
import { Tab2Service } from '../../tab2.service';

@Component({
  selector: 'app-nota.form',
  templateUrl: './nota.form.component.html',
  styleUrls: ['./nota.form.component.scss'],
})
export class NotaFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Nota    = new Nota();
  public obras:any;
  public color_categoria = "#FFF";
  public categorias:any = [];
  public estados:any = [];

  private router_subs:any;
  private obras_subs:any;
  
  private getAllSubj:any;


  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    private privateNotaService:          PrivateNotaService,
    private privateObrasService:         PrivateObrasService,
    private privateCategoriaService:     PrivateCategoriaService,
    private privateEstadoService:        PrivateEstadoService,
    private tab2Service:                 Tab2Service,
    private formateoService:             FormateoService
  ) {
    super(alertController, loadingController, ref);
  }

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_nota') != -1) {
          this.accion = 'Nueva';
          this.tab2Service.recargarObras.next();
          this.loadingEspecificData(this.privateCategoriaService, '',   'categorias', 'Consultando Categorias.');
        } else if (event.url.search('editar_nota') != -1){
          this.tab2Service.recargarObras.next();
          this.loadingEspecificData(this.privateCategoriaService, '',   'categorias', 'Consultando Categorias.');
          this.accion = 'Editar';
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          this.privateNotaService.get(this.tab2Service.nota_edit_id).subscribe(
            ok => {
              loading.dismiss();
              this.model = ok;
            },
            err => {
              loading.dismiss();
            }
          );
        }
      });
    }

    if (this.obras_subs == undefined){
      this.obras_subs = this.tab2Service.recargarObras.subscribe({ next:() => {
        this.loadingEspecificData(this.privateObrasService, 'filter[habilitada]=1',   'obras', 'Consultando obras.');
      }});
    }

    if (this.getAllSubj == undefined){
      this.getAllSubj = this.getAllSubject.subscribe({ next:(data) => {
        if (data.service.recurso == 'private-obras'){
          if (this.accion == 'Nueva'){
            this.model.obra_id = String(this.tab2Service.nueva_nota_obra_id);
          } else {
            this.model.obra_id = String(this.model.obra_id);
          }
        }
        if(data.service.recurso == 'private-categoria'){
          this.model.categoria_id = String(this.model.categoria_id);
        }
        if(data.service.recurso == 'private-estado'){
          this.model.estado_id = String(this.model.estado_id);
        }
      }});
    }

    this.loadingEspecificData(this.privateCategoriaService, '',   'categorias', 'Consultando Categorias.');
    
    this.tab2Service.recargarObras.next();
  }

  categoria_change(){
    for (let c=0; c < this.categorias.length; c++){
      if (this.categorias[c].id == this.model.categoria_id){
        this.color_categoria = this.categorias[c].color;
        this.cargar_estados(this.model.categoria_id);
        break;
      } 
    }
  }

  cargar_estados(id){
    this.loadingEspecificData(this.privateEstadoService, 'filter[categoria_id]='+id,   'estados', 'Consultando Estados.');
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('nota') || this.model.nota == ''){
      super.displayAlert("Es necesario completar el texto correspondiente a la nota."); return false;
    }

    if ( !this.model.hasOwnProperty('categoria_id') || this.model.categoria_id == -1){
      super.displayAlert("Es necesario definir una categoría."); return false;
    }

    if ( !this.model.hasOwnProperty('estado_id') || this.model.estado_id == -1){
      super.displayAlert("Es necesario definir un estado."); return false;
    }
    
    if ( !this.model.hasOwnProperty('obra_id') || this.model.obra_id == undefined ||  this.model.obra_id == "undefined"){
      super.displayAlert("Es necesario definir una obra."); return false;
    }

    if ( !this.model.hasOwnProperty('vencimiento') || this.model.vencimiento == undefined){
      super.displayAlert("Es necesario definir una fecha de vencimiento."); return false;
    }
    const loading = await this.loadingController.create({ message: "Por favor espere..." });

    this.model.vencimiento = this.formateoService.getFormatedDate(new Date(this.model.vencimiento));
    if (this.accion == 'Nueva'){
      this.privateNotaService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Nota creado.");
          loading.dismiss();
          this.goBack();
        },
        err => {
          super.displayAlert("Ha ocurrido un error, revise los datos del formulario o reintente mas tarde.");
          loading.dismiss();
        }
      );
    }  else if (this.accion == 'Editar'){
      this.privateNotaService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado la nota.");
          loading.dismiss();
          this.tab2Service.recargarNotas.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    }
  }

  OnDestroy(){
    this.router_subs.unsubscribe();
    this.obras_subs.unsubscribe();
    this.getAllSubj.unsubscribe();
  }
  
  goBack(){
    this.router.navigate([ this.tab2Service.navigationOrigin ]);
  }

}
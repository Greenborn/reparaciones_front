import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Nota } from 'src/app/models/nota';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormateoService } from 'src/app/services/formateo.service';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';
import { PrivateTipoNotaService } from 'src/app/services/private.tipo.nota.service';

@Component({
  selector: 'app-nota.form',
  templateUrl: './nota.form.component.html',
  styleUrls: ['./nota.form.component.scss'],
})
export class NotaFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  @ViewChild('dp') dp: NgbDatepicker;

  public model:Nota    = new Nota();
  public color_categoria = "#FFF";
  public color_tipo_nota = "#FFF";
  public estados:any = [];

  private router_subs:any;
  
  private getAllSubj:any = [];
  private imageOnSuccessSubj:any;
  private base64ConvertCallBackSubj:any;

  private thisPage:string = '';
  public imagenes:any = [];
  private imagenes_nota:any = [];
  private getedSubj:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    public  privateNotaService:          PrivateNotaService,
    public  privateObrasService:         PrivateObrasService,
    public  privateCategoriaService:     PrivateCategoriaService,
    private privateEstadoService:        PrivateEstadoService,
    private formateoService:             FormateoService,
    public  privateTipoNotaService:      PrivateTipoNotaService,
    private privateImagenService:        PrivateImagenService,
    private configService:               ConfigService,
    public  authService:                 AuthService, 
  ) {
    super(alertController, loadingController, ref, authService);

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(
        this.privateObrasService.getAllOK.subscribe({ next:(data) => {
          if (this.privateNotaService.accion == 'Nueva'){
              this.model.obra_id = String(this.privateNotaService.nueva_nota_obra_id);
          } else {
              this.model.obra_id = String(this.model.obra_id);
          }
        }})
      );
      this.getAllSubj.push(
        this.privateCategoriaService.getAllOK.subscribe({ next:(data) => {
          this.model.categoria_id = String(this.model.categoria_id);
        }})
      );

      this.getAllSubj.push(
        this.privateTipoNotaService.getAllOK.subscribe({ next:(data) => {
          this.model.tipo_nota_id = String(this.model.tipo_nota_id);
        }})
      );

      this.getAllSubj.push(
        this.privateEstadoService.getAllOK.subscribe({ next:(data) => {
          this.model.estado_id = String(this.model.estado_id);
        }})
      );
    }

    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_nota') != -1) {
          this.model = new Nota();
          this.thisPage = '/tabs/tab2/crear_nota';
          this.color_categoria = "#FFF";
          this.color_tipo_nota = "#FFF";
        } else 
        if (event.url.search('editar_nota') != -1){
          this.thisPage = '/tabs/tab2/editar_nota';
        }
      });
    }

    if (this.imageOnSuccessSubj == undefined){
      this.imageOnSuccessSubj = this.imageOnSuccess.subscribe({ next:(p) => {
        this.imagenes.push(p);
      }});
    }

    if (this.base64ConvertCallBackSubj == undefined){
      this.base64ConvertCallBackSubj = this.privateNotaService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagenes.push({ file: p.base64, name:p.anydata.url, fromnota: true });
      }});
    }

    if (this.getedSubj == undefined){
      this.getedSubj = this.privateNotaService.getEdOk.subscribe({ next:(p:any) => {
        this.model = p;
      }});
    }
  }

  ngOnInit() {
  }


  ver_imagen(i){
    this.privateNotaService.navigationOrigin = this.thisPage;
    this.router.navigate([ '/tabs/tab3/vista_imagen' ]);
  }

  categoria_change(){
    for (let c=0; c < this.privateCategoriaService.all.length; c++){
      if (this.privateCategoriaService.all[c].id == this.model.categoria_id){
        this.color_categoria = this.privateCategoriaService.all[c].color;
        this.cargar_estados(this.model.categoria_id);
        break;
      } 
    }
  }

  tiponota_change(){
    for (let c=0; c<this.privateTipoNotaService.all.length; c++){
      if (this.privateTipoNotaService.all[c].id == this.model.tipo_nota_id){
        this.color_tipo_nota = this.privateTipoNotaService.all[c].color;
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
    loading.present();
    this.model.vencimiento = this.formateoService.getDateNgbDatepickerArray(this.model.vencimiento);
    this.model.vencimiento.setSeconds(this.model.vencimiento_hora.second);
    this.model.vencimiento.setHours(this.model.vencimiento_hora.hour);
    this.model.vencimiento.setMinutes(this.model.vencimiento_hora.minute);
    this.model.vencimiento = this.formateoService.getFechaISOASP(this.model.vencimiento);

    this.model.images = this.imagenes;

    if (this.privateNotaService.accion == 'Nueva'){
      this.privateNotaService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Nota creado.");
          loading.dismiss();
          this.privateNotaService.goToNotas({ page:this });
        },
        err => {
          super.displayAlert("Ha ocurrido un error, revise los datos del formulario o reintente mas tarde.");
          loading.dismiss();
        }
      );
    }  else if (this.privateNotaService.accion == 'Editar'){
      this.privateNotaService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado la nota.");
          loading.dismiss();
          this.privateNotaService.goToNotas({ page:this, obra:this.model.obra_id, nombre_obre:this.privateNotaService.ver_nota_obra_nombre });
        },
        err => {
          loading.dismiss();
        }
      );
    }
  }

  OnDestroy(){
    this.router_subs.unsubscribe();
    for (let c=0; c<this.getAllSubj.length;c++){
      this.getAllSubj[c].unsubscribe();
    }
    this.imageOnSuccessSubj.unsubscribe();
    this.getedSubj.unsubscribe();
    this.base64ConvertCallBackSubj.unsubscribe();
  }
  
  goBack(){
    this.router.navigate([ this.privateNotaService.navigationOrigin ]);
  }

  deleteImg(i){

  }

}
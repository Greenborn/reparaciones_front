import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormateoService } from './formateo.service';
import { PrivateCategoriaService } from './private.categoria.service';
import { PrivateObrasService } from './private.obras.service';
import { PrivateTipoNotaService } from './private.tipo.nota.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateNotaService extends ApiService<any>{

  constructor( 
    http:                            HttpClient,
    config:                          ConfigService,
    private router:                  Router,
    private privateObrasService:     PrivateObrasService,
    private privateCategoriaService: PrivateCategoriaService,
    private privateTipoNotaService:  PrivateTipoNotaService,
    private loadingController:       LoadingController,
    private toastController:         ToastController,
    private formateoService:         FormateoService,
    private configService:           ConfigService
  ) {
      super('private-nota', http, config)
     }
    
    get template(): any {
        return {
            
        }
    }

    public vencidas:any         = [];
    public cant_vencidas:number = 0;
    public filtro_vencidas:string = 'todas';
    public toastShow:boolean = true;
    
    pingNotasVencidas(p){
      let date:any = new Date();
      date = date.toISOString();
      let params = 'filter[vencimiento]=<' + date;
      this.getAll(params).subscribe(
        ok => {
          this.vencidas      = ok;
          this.cant_vencidas = this.vencidas.length;
          if (this.toastShow){
              this.toastVencidas('¡Hay '+this.cant_vencidas + ' notas vencidas!', p);
              this.toastShow = false;
          }
        },
        err => {}
      );
    }

    put(model: any, id: number, recurso: string = null): Observable<any> {
      let img:any = [];
      for (let c=0; c < model.images.length; c++){
          if (!model.images[c].hasOwnProperty('fromnota')){
            img.push(model.images[c]);
          }
      }
      model.images = img;
      return super.put(model, id, recurso);
    }

    public nota_images:any = [];
    public nota_documentos:any = [];
    get(id: number, getParams: string = ''): Observable<any> {  
      return super.get(id, getParams).pipe(
        map((data) => {
          let d = new Date(data.vencimiento);
          data.vencimiento = this.formateoService.getNgbDatepickerArrayFDate(d);
          data.vencimiento_hora = this.formateoService.getNgbTimePickerFDate(d);
          this.nota_images = [];
          this.nota_documentos = [];
          for(let c=0; c < data.imagenes.length; c++){
            this.imgUrlToBase64(this.configService.apiUrl(data.imagenes[c].url), data.imagenes[c], (p)=>{
              this.nota_images.push({ file: p.base64, name:p.anydata.url, fromnota: true, id:p.anydata.id });
            });
          }

          for(let c=0; c < data.documentos.length; c++){
            this.nota_documentos.push({ file: '', name:data.documentos[c].nombre, fromnota: true, id:data.documentos[c].id, url:data.documentos[c].url });
          }
          return data;
        })
      );
    }

    async toastVencidas(text, params){
      const toast = await this.toastController.create({
        message: text,
        duration: 300000,
        buttons: [
          {
            side: 'end',
            icon: 'eye',
            text: 'Ver',
            handler: () => {
              this.filtro_vencidas = 'vencidas';
              this.goToNotas(params);
            }
          },
          {
            side: 'end',
            icon: 'close',
            text: '',
            handler: () => {
              toast.dismiss();
            }
          }
        ],
      });
      toast.present();
    }

    public ver_nota_obra_id:number;
    public ver_nota_obra_nombre;
    async goToNotas(params:any = {}){
      if (params.hasOwnProperty('nombre_obra')){
        this.ver_nota_obra_nombre = params.nombre_obra;
      }
      if (params.hasOwnProperty('page')){
        let page = params.page;
        let params_peticion:string = 'expand=categoria,obra,tipoNota';
        this.all = [];

        if (params.hasOwnProperty('obra') && params.obra != undefined){
          this.ver_nota_obra_id = params.obra;
          params_peticion += '&filter[obra_id]='+this.ver_nota_obra_id;
        } 

        if (this.filtro_vencidas == 'vencidas'){
          let date:any = new Date();
          date = date.toISOString();
          params_peticion += '&filter[vencimiento]=<' + date;
        }

        page.loadingEspecificData(this, params_peticion,   '', 'Consultando notas.');
      } else {
        const loading = await this.loadingController.create({ message: "Por favor espere..." });
        loading.present();
        let tmpSubj = this.getAll('expand=categoria,obra,tipoNota').subscribe(
          ok => {  
            tmpSubj.unsubscribe(); 
            loading.dismiss();
          },
          err => { 
            tmpSubj.unsubscribe(); 
            loading.dismiss();
          }
        );
      }
      
      this.router.navigate([ '/tabs/tab2/notas' ]);
    }

    public navigationOrigin;
    public nueva_nota_obra_id;
    public accion:string = 'Nueva';
    goToNueva(params:any = {}){
      this.accion = 'Nueva';
      if (params.hasOwnProperty('navigationOrigin')){
        this.navigationOrigin = params.navigationOrigin;
      }

      if (params.hasOwnProperty('page')){
        if (params.page.hasOwnProperty('imagenes'))
          params.page.imagenes = [];
        this.privateObrasService.obra_filter_enabled = 'enabled';
        this.privateObrasService.recargarObras(params.page);                                                        //se recarga el listado de obras
        params.page.loadingEspecificData(this.privateCategoriaService, '',   '', 'Consultando Categorias.');        //se recarga el listado de categorias
        params.page.loadingEspecificData(this.privateTipoNotaService, '',   '', 'Consultando Tipos de notas.');     //se recarga el listado de tipos de notas

        if (params.hasOwnProperty('obra_id')){
          this.nueva_nota_obra_id = params.obra_id;
        }

      }
      
      this.router.navigate([ '/tabs/tab2/crear_nota' ]);
    }

    public nota_edit_id:number = 0;
    async goToEdit(params:any = {}){
      this.accion = 'Editar';
      if (params.hasOwnProperty('navigationOrigin')){
        this.navigationOrigin = params.navigationOrigin;
      }

      if (params.hasOwnProperty('page')){
        
        if (params.hasOwnProperty('nota_id')){
          this.nota_edit_id = params.nota_id;
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          loading.present();
          let tmpSubj = this.get(this.nota_edit_id,'expand=imagenes,documentos').subscribe(
            ok => {  
              tmpSubj.unsubscribe(); 
              loading.dismiss();
            },
            err => { 
              tmpSubj.unsubscribe(); 
              loading.dismiss();
            }
          );
        }

        this.privateObrasService.obra_filter_enabled = 'enabled';
        this.privateObrasService.recargarObras(params.page);                                                        //se recarga el listado de obras
        params.page.loadingEspecificData(this.privateCategoriaService, '',   '', 'Consultando Categorias.');        //se recarga el listado de categorias
        params.page.loadingEspecificData(this.privateTipoNotaService, '',   '', 'Consultando Tipos de notas.');     //se recarga el listado de tipos de notas
      }
      this.router.navigate([ '/tabs/tab2/editar_nota' ]);
    }
}
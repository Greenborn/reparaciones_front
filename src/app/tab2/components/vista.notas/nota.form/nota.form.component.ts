import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormateoService } from 'src/app/services/formateo.service';
import { PrivateCategoriaService2 } from 'src/app/services/private.categoria.service2';

import { PrivateDocumentoService } from 'src/app/services/private.documento.service';
import { PrivateEstadoService2 } from 'src/app/services/private.estado.service2';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';
import { PrivateNotaService2 } from 'src/app/services/private.nota.service2';

import { PrivateObrasService } from 'src/app/services/private.obras.service';

import { PrivateTipoNotaService2 } from 'src/app/services/private.tipo.nota.service2';

@Component({
  selector: 'app-nota.form',
  templateUrl: './nota.form.component.html',
  styleUrls: ['./nota.form.component.scss'],
})
export class NotaFormComponent  implements OnInit, OnDestroy {

  @ViewChild('dp') dp: NgbDatepicker;

  public color_categoria = "#FFF";
  public color_tipo_nota = "#FFF";
  public estados:any = [];

  private subcripciones:any = [];

  constructor(
    public  privateNotaService:          PrivateNotaService2,

    public  privateObrasService:         PrivateObrasService,
    public  privateCategoriaService:     PrivateCategoriaService2,
    private privateEstadoService:        PrivateEstadoService2,
    public  privateTipoNotaService:      PrivateTipoNotaService2,

    private formateoService:             FormateoService,
    
    private privateImagenService:        PrivateImagenService,
    
    public  configService:               ConfigService,
    public  privateDocumentoService:     PrivateDocumentoService,
    
    private appUIUtilsService:           AppUIUtilsService, 
    
    private activatedRoute:              ActivatedRoute
    ) {

    }

    ngOnInit() {
        //SUBSCRIPCIONES
        this.subcripciones.push(
            this.activatedRoute.paramMap.subscribe(async params => { 
                this.privateNotaService.inic_modelo();

                let id:any = params.get('id_obra');
                if (id !== null){
                    this.privateNotaService.modelo_edit.obra_id = String(id);
                }
            })
        );
        
        //NOS ASEGURAMOS DE CARGAR EL LISTADO DE OBRAS
        //SOLO LAS QUE ESTAN HABILITADAS
        if (this.privateObrasService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: 'Consultando listado de obras...' });

            this.privateObrasService.getAll({
                getParams: 'filter[habilitada]=1',
                callback: ()=>{ 
                    this.privateNotaService.modelo_edit.obra_id = String( this.privateNotaService.modelo_edit.obra_id );
                    this.appUIUtilsService.dissmisLoading();
                }
            });
        }

        //NOS ASEGURAMOS DE CARGAR LAS TIPOS DE NOTAS
        if (this.privateTipoNotaService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: 'Consultando listado de tipos de notas...' });

            this.privateTipoNotaService.getAll({
                getParams: '',
                callback: ()=>{
                    this.privateNotaService.modelo_edit.tipo_nota_id = String( this.privateNotaService.modelo_edit.tipo_nota_id );
                    this.appUIUtilsService.dissmisLoading();
                }
            });
        }

        //NOS ASEGURAMOS DE CARGAR LAS CATEGORIAS
        if (this.privateCategoriaService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: 'Consultando listado de categorias...' });

            this.privateCategoriaService.getAll({
                getParams: '',
                callback: ()=>{
                    this.privateNotaService.modelo_edit.categoria_id = String( this.privateNotaService.modelo_edit.categoria_id );
                    this.appUIUtilsService.dissmisLoading();
                }
            });
        }        
    }

    async deleteDoc(documento, i){

        this.privateNotaService.nota_documentos.splice(i);

        if (!documento.hasOwnProperty('fromnota')) {
            return true;
        }

        this.appUIUtilsService.displayAlert('Está por eliminar el documento ¿Desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_doc(documento); } }
        ]);
    }

    async borrar_doc(documento){
       
        this.appUIUtilsService.presentLoading({ message: 'Borrando documento...' });
        this.privateDocumentoService.delete(documento.id).subscribe(
            ok => {
                this.appUIUtilsService.dissmisLoading(); 
            },
            err => {
                this.appUIUtilsService.dissmisLoading(); 
                this.appUIUtilsService.displayAlert('Ocurrió un error al intentar eliminar la nota. ', 'Atención', [
                    { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
                ]);
            }
        );
    }


  ver_imagen(i){
   //[REFACTORIZAR] this.privateNotaService.navigationOrigin = '/tabs/tab2/editar_nota';
    this.privateImagenService.goToEdit({ page:this, img_id:i.id });
  }

    categoria_change(){
        for (let c=0; c < this.privateCategoriaService.all.length; c++){
            if (this.privateCategoriaService.all[c].id == this.privateNotaService.modelo_edit.categoria_id){
                this.color_categoria = this.privateCategoriaService.all[c].color;
                this.cargar_estados(this.privateNotaService.modelo_edit.categoria_id);
                break;
            } 
        }
    }

    tiponota_change(){
        for (let c=0; c<this.privateTipoNotaService.all.length; c++){
            if (this.privateTipoNotaService.all[c].id == this.privateNotaService.modelo_edit.tipo_nota_id){
                this.color_tipo_nota = this.privateTipoNotaService.all[c].color;
                break;
            }
        }
    }

    cargar_estados(id){
        //SE CARGAN LOS ESTADOS
        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de estados...' });

        this.privateEstadoService.getAll({
            getParams: 'filter[categoria_id]='+id,
            callback: ()=>{ 
                this.appUIUtilsService.dissmisLoading();
            }
        });
    }

    async ingresar(){

        let validacionResult = this.privateNotaService.modelo_edit.datosValidos(); 
        if ( !validacionResult.success ){
            this.appUIUtilsService.displayAlert(validacionResult.msg, 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            return false;
        }

        this.privateNotaService.modelo_edit.preparar_envio( this.formateoService, this.privateNotaService );

        this.privateNotaService.guardar_modelo();
    }

    ngOnDestroy(){
        for (let c=0; c < this.subcripciones.length; c++){
            this.subcripciones[c].unsubscribe();
        }
    }
  
  goBack(){
    //[REFACTORIZAR]this.router.navigate([ this.privateNotaService.navigationOrigin ]);
  }

    async deleteImg(i){
        for (let c=0; c < this.privateNotaService.nota_images.length; c++){
            if (this.privateNotaService.nota_images[c].name == i.name){
                this.appUIUtilsService.displayAlert('Está por eliminar una imagen ¿desea continuar?.', 'Atención', [
                    { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
                    { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_img(i); } }
                ]);
            }
        }
    }

    async borrar_img(i:any){
        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de estados...' });

        this.privateImagenService.delete(i.id).subscribe(
            ok => {
                this.appUIUtilsService.dissmisLoading(); 
                let nota_id = this.privateNotaService.modelo_edit.id;
                this.privateNotaService.goToEdit({ nota_id:nota_id, navigationOrigin:'/tabs/tab2' });
            },
            err => {
                this.appUIUtilsService.dissmisLoading(); 
                this.appUIUtilsService.displayAlert('Ocurrió un error al intentar eliminar la imagen.', 'Error', [
                    { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
                ]);
            }
        );
    }

}
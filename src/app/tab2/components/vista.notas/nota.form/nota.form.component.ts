import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormateoService } from 'src/app/services/formateo.service';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';

import { PrivateDocumentoService } from 'src/app/services/private.documento.service';
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
export class NotaFormComponent  implements OnInit, OnDestroy {

  @ViewChild('dp') dp: NgbDatepicker;

  public estados:any = [];

  private subcripciones:any = [];

  constructor(
    public  privateNotaService:          PrivateNotaService,

    public  privateObrasService:         PrivateObrasService,
    public  privateCategoriaService:     PrivateCategoriaService,
    public  privateEstadoService:        PrivateEstadoService,
    public  privateTipoNotaService:      PrivateTipoNotaService,

    private formateoService:             FormateoService,
    
    private privateImagenService:        PrivateImagenService,
    
    public  configService:               ConfigService,
    public  privateDocumentoService:     PrivateDocumentoService,
    
    private appUIUtilsService:           AppUIUtilsService, 
    
    private activatedRoute:              ActivatedRoute,
    private navController:               NavController
    ) {

    }

    ngOnInit() {
        //SUBSCRIPCIONES
        this.subcripciones.push( this.privateNotaService.getOneOK.subscribe({ next:(p:any) => {
            this.categoria_change();
            this.tiponota_change();
        }}));

        this.subcripciones.push(
            this.activatedRoute.paramMap.subscribe(async params => { 
                this.privateNotaService.inic_modelo();

                //Si se trata de una nota nueva a la cual se le especifica id de obra
                let id_obra:any = params.get('id_obra');
                if (id_obra !== null){
                    this.privateNotaService.modelo_edit.obra_id = String(id_obra);
                }

                //Si se trata de la edicion de una nota existente, hay que cargar sus datos
                let id_nota = params.get('id_nota');
                if (id_nota !== null){
                    this.privateNotaService.operacion_actual = 'Editar';
                    this.privateNotaService.get( Number(id_nota), 'expand=imagenes,documentos')
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
                    this.appUIUtilsService.dissmisLoading();
                }
            });
        }        
    }

    async deleteDoc(documento, i){

        if (!documento.hasOwnProperty('fromnota')) {
            this.privateNotaService.nota_documentos.splice(i);
            return true;
        }

        this.appUIUtilsService.displayAlert('Está por eliminar el documento ¿Desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_doc(documento, i); } }
        ]);
    }

    async borrar_doc(documento, i){
       
        this.appUIUtilsService.presentLoading({ message: 'Borrando documento...' });
        this.privateDocumentoService.delete(documento.id).subscribe(
            ok => {
                this.privateNotaService.nota_documentos.splice(i);
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
        this.cargar_estados(this.privateNotaService.modelo_edit.categoria_id);
    }

    tiponota_change(){
        
    }

    color_categoria( categoria_id:number ){
        for (let c=0; c < this.privateCategoriaService.all.length; c++){
            if ( this.privateCategoriaService.all[c].id == categoria_id ){
                return this.privateCategoriaService.all[c].color;
            } 
        }

        return "#FFF"; 
    }

    color_tipo_nota( tipo_nota_id:number ){
        for (let c=0; c<this.privateTipoNotaService.all.length; c++){
            if (this.privateTipoNotaService.all[c].id == tipo_nota_id){
                return this.privateTipoNotaService.all[c].color;
            }
        }

        return "#FFF";
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

    ingresar(){

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
        this.navController.pop();
    }

    async deleteImg(i){
        for (let c=0; c < this.privateNotaService.nota_images.length; c++){
            if (this.privateNotaService.nota_images[c].name == i.name){
                //si la imagen no esta registrada en la base de datos solo se la borra del arreglo
                if (!i.hasOwnProperty('fromnota')) {
                    this.privateNotaService.nota_images.splice(c);
                    return false;
                }

                this.appUIUtilsService.displayAlert('Está por eliminar una imagen ¿desea continuar?.', 'Atención', [
                    { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
                    { text:'Si', css_class: 'btn-warning',callback:()=> { this.appUIUtilsService.dissmissAlert(); this.borrar_img(i); } }
                ]);
            }
        }
    }

    async borrar_img(i:any){        
        this.appUIUtilsService.presentLoading({ message: 'Borrando imagen...' });

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
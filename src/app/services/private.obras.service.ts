import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Obra } from '../models/obra';
import { ApiServiceBase } from './api.service.base';
import { AppUIUtilsService } from './app.ui.utils.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateObrasService extends ApiServiceBase{

    all: any =[];
    meta:any;
    getAllOK:Subject<any> = new Subject();
    getAllKO:Subject<any> = new Subject();
    total_count:number  = 0;

    one:any;
    getOneOK:Subject<any> = new Subject();
    getOneKO:Subject<any> = new Subject();
    deleted_id:number;
    deletedOK:Subject<any> = new Subject();
    deletedKO:Subject<any> = new Subject();

    edited_id:number;
    editedOK:Subject<any> = new Subject();
    editedKO:Subject<any> = new Subject();

    post_id:number;
    postedOK:Subject<any> = new Subject();
    postedKO:Subject<any> = new Subject();
    last_err:any;

    img_hfi_result = null;
    image_data:any;
    file_data:any;
    file_data_extension:string;

    imageOnSuccess:Subject<any> = new Subject();
    imageOnError:Subject<any> = new Subject();


    constructor( 
      http:                          HttpClient,
      config:                        ConfigService,
      private navController:         NavController,
      appUIUtilsService:             AppUIUtilsService
    ) {
        super('private-obras', http, config, appUIUtilsService);
        this.defSubscripcionesAPI();
    }

    //subscripciones
    private subscripciones:any = [];

    //modelos
    public modelo_edit:Obra;

    //Estados
    public operacion_actual:string = 'Nueva';
    //paginas
    public page:any;


    public guardar_modelo(){
        this.appUIUtilsService.presentLoading({ message: "Guardando..." });
        
        if (this.operacion_actual == 'Nueva'){
            this.post(this.modelo_edit);
        } else if (this.operacion_actual == 'Editar'){
            this.put(this.modelo_edit, this.modelo_edit.id);
        }
    }
    

    public defSubscripcionesAPI(){
        

        //////////// OBRA
        //GET ALL
        this.subscripciones.push( this.getAllOK.subscribe({ next:(p:any) => {
            
        }}));

        //ERROR AL INTENTAR OBTENER LISTA DE OBRAS
        this.subscripciones.push( this.getAllKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //GET
        this.subscripciones.push( this.getOneOK.subscribe({ next:(p:any) => {
            this.modelo_edit = this.one;
            this.appUIUtilsService.dissmisLoading();
            if (this.modelo_edit['imagen']!= null){
                this.imgUrlToBase64(this.config.apiUrl(this.modelo_edit[`imagen`].url));
            } 
        }}));

        //ERROR AL INTENTAR OBTENER OBRA
        this.subscripciones.push( this.getOneKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //POST
        this.subscripciones.push( this.postedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.displayAlert("Nuevo registro de Obra creado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.recargarObras(this);
            this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.postedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //PUT 
        this.subscripciones.push( this.editedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.displayAlert("Se ha modificado la obra.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.recargarObras();
            this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.editedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        /// DELETE
        this.subscripciones.push( this.deletedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Obra eliminada correctamente.', 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.recargarObras();
        }}));

        this.subscripciones.push( this.deletedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading(); 
            this.recargarObras();
        }}));


        //////////////////////// MANEJO DE IMAGENES
        this.subscripciones.push( this.imageOnSuccess.subscribe({ next:(p:any) => {
            this.modelo_edit.imagen_data = this.image_data;
        }}));

        this.subscripciones.push( this.base64ConvertCallBack.subscribe({ next:(p) => {
            this.image_data = { file: p.base64 };
        }}));
    }

    public desubscriptAPI(){
        for (let c=0; c < this.subscripciones.length; c++){
            this.subscripciones[c].unsubscribe();
        }
    }

    public obra_filter_enabled:string = 'enabled';

     public recargarObras( params:any = {} ){
        let filter:string    = '';
        let paramsGetAll:any = {};
        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de obras...' });

        if ( this.obra_filter_enabled == 'enabled' ){
            filter = 'filter[habilitada]=1';
        }

        paramsGetAll.getParams = String(filter+'&expand=imagen');
        paramsGetAll.callback  = () => {
            this.appUIUtilsService.dissmisLoading();

            if ( params.hasOwnProperty('callback') ){
                params.callback();
            }
        };

        this.getAll( paramsGetAll );
        this.navController.navigateForward([ '/tabs/tab1' ]);
    }

    ///Borrandoprivate extra_del_params:any = {};
    borrar_obra(obra:Obra){
        this.appUIUtilsService.presentLoading({ message: 'Borrando obra: ' + obra.nombre_alias});
        this.delete(obra.id);
    }

    eliminar_info_imagen(){
        this.image_data              = undefined;
    }

    /// NAVEGACION
    goToEdit( id:number ){
        this.navController.navigateForward([ '/tabs/tab1/editar_obra/'+id ]);
        this.operacion_actual = 'Editar';
        this.appUIUtilsService.presentLoading({ message: 'Consultando obra...' });
        this.modelo_edit      = undefined;
        this.get(id, 'expand=imagen');
    }

    goToCreate(){
        this.navController.navigateForward([ '/tabs/tab1/crear_obra' ]);
        this.modelo_edit      = new Obra();
        this.eliminar_info_imagen();
        this.operacion_actual = 'Nueva';
    }

    goBack(){
        this.navController.navigateForward([ '/tabs/tab1' ]);
    }
    
}
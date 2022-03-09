import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';
import { Obra } from '../models/obra';
import { ApiServiceBase } from './api.service.base';
import { AppUIUtilsService } from './app.ui.utils.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateObrasService extends ApiServiceBase{

    constructor( 
      http:                          HttpClient,
      config:                        ConfigService,
      private router:                Router,
      private appUIUtilsService:     AppUIUtilsService,
      private loadingController:     LoadingController
    ) {
        super('private-obras', http, config);
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
            this.appUIUtilsService.dissmisLoading();

            if (this.getAllCallback !== null){
                this.getAllCallback();
            }
        }}));

        //ERROR AL INTENTAR OBTENER LISTA DE OBRAS
        this.subscripciones.push( this.getAllKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar obtener el listado de obras.');
            console.log(this.last_err);
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
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar obtener la obra.');
            console.log(this.last_err);
        }}));

        //POST
        this.subscripciones.push( this.postedOK.subscribe({ next:(p:any) => {
                this.appUIUtilsService.displayAlert("Nuevo registro de Obra creado.");
                this.appUIUtilsService.dissmisLoading();
                this.recargarObras(this);
                this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.postedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar crear la obra.');
            console.log(this.last_err);
        }}));

        //PUT 
        this.subscripciones.push( this.editedOK.subscribe({ next:(p:any) => {
                this.appUIUtilsService.displayAlert("Se ha modificado la obra.");
                this.appUIUtilsService.dissmisLoading();
                this.recargarObras();
                this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.editedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar modificar la obra.');
            console.log(this.last_err);
        }}));

        /// DELETE
        this.subscripciones.push( this.deletedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.recargarObras();
        }}));

        this.subscripciones.push( this.deletedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading(); 
            this.recargarObras();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar eliminar la obra.');
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

    private getAllCallback:any = null;
    public recargarObras( params:any = {} ){
        let filter:string = '';
        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de obras...' });

        if ( params.hasOwnProperty('callback') ){
            this.getAllCallback = params.callback;
        }

        if ( this.obra_filter_enabled == 'enabled' ){
            filter = 'filter[habilitada]=1';
        }

        this.getAll( filter+'&expand=imagen' );
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
        this.router.navigate([ '/tabs/tab1/editar_obra/'+id ]);
        this.operacion_actual = 'Editar';
        this.appUIUtilsService.presentLoading({ message: 'Consultando obra...' });
        this.modelo_edit      = undefined;
        this.get(id, 'expand=imagen');
    }

    goToCreate(){
        this.router.navigate([ '/tabs/tab1/crear_obra' ]);
        this.modelo_edit      = new Obra();
        this.eliminar_info_imagen();
        this.operacion_actual = 'Nueva';
    }

    goBack(){
        this.router.navigate([ '/tabs/tab1' ]);
    }
    
}
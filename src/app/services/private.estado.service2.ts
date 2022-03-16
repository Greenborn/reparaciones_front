import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Estado } from '../models/estado';

import { ApiServiceBase } from './api.service.base';
import { AppUIUtilsService } from './app.ui.utils.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateEstadoService2 extends ApiServiceBase{

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
        super('private-estado', http, config, appUIUtilsService);
        this.defSubscripcionesAPI();
    }

    //subscripciones
    private subscripciones:any = [];

    //modelos
    public modelo_edit:Estado = new Estado();

    //Estados
    public operacion_actual:string = 'Nueva';
    //paginas
    public page:any;


    public guardar_modelo(){
        this.appUIUtilsService.presentLoading({ message: "Guardando..." });
        
        if (this.operacion_actual == 'Nuevo'){
            this.post(this.modelo_edit);
        } else if (this.operacion_actual == 'Editar'){
            this.put(this.modelo_edit, this.modelo_edit.id);
        }
    }

    defSubscripcionesAPI(){
        //////////// NOTAS
        //GET ALL
        this.subscripciones.push( this.getAllOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //ERROR AL INTENTAR OBTENER LISTA DE NOTAS
        this.subscripciones.push( this.getAllKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //GET
        this.subscripciones.push( this.getOneOK.subscribe({ next:(p:any) => {
            this.modelo_edit = new Estado(this.one);
            this.appUIUtilsService.dissmisLoading();
        }}));

        //ERROR AL INTENTAR OBTENER Nota
        this.subscripciones.push( this.getOneKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //POST
        this.subscripciones.push( this.postedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.displayAlert("Nuevo registro de estado creado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.postedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //PUT 
        this.subscripciones.push( this.editedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.displayAlert("Se ha modificado el estado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.editedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        /// DELETE
        this.subscripciones.push( this.deletedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Estado eliminado correctamente.', 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
        }}));

        this.subscripciones.push( this.deletedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading(); 
        }}));
    }


    //NAVEGACION
    //NUEVO Estado
    goToCreate( params:any = {} ){
        this.modelo_edit              = new Estado();
        this.modelo_edit.categoria_id = params.categoria_id;
        this.operacion_actual         = 'Nuevo';
        this.navController.navigateForward([ '/tabs/tab3/crear_estado' ]);
    }

    goToEdit( params:any = {}){
        this.navController.navigateForward([ '/tabs/tab3/editar_estado/' + params.estado_id ]);
        this.operacion_actual = 'Editar';
        this.appUIUtilsService.presentLoading({ message: 'Consultando estado...' });
        this.modelo_edit      = new Estado();
    }

    goBack(){
        this.navController.pop();
    }
    
}
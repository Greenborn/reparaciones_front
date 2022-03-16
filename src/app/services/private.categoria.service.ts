import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Categoria } from '../models/categoria';

import { ApiServiceBase } from './api.service.base';
import { AppUIUtilsService } from './app.ui.utils.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateCategoriaService extends ApiServiceBase{

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
        super('private-categoria', http, config, appUIUtilsService);
        this.defSubscripcionesAPI();
    }

    //subscripciones
    private subscripciones:any = [];

    //modelos
    public modelo_edit:Categoria = new Categoria();

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
            this.modelo_edit = new Categoria(this.one);
            this.appUIUtilsService.dissmisLoading();
        }}));

        //ERROR AL INTENTAR OBTENER Nota
        this.subscripciones.push( this.getOneKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //POST
        this.subscripciones.push( this.postedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.displayAlert("Nuevo registro de categoría creado.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.getAll();
            this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.postedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        //PUT 
        this.subscripciones.push( this.editedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.displayAlert("Se ha modificado la categoría.", 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.appUIUtilsService.dissmisLoading();
            this.getAll();
            this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA OBRA
        this.subscripciones.push( this.editedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));

        /// DELETE
        this.subscripciones.push( this.deletedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Categoría eliminada correctamente.', 'Atención', [
                { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
            ]);
            this.getAll();
        }}));

        this.subscripciones.push( this.deletedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
        }}));
    }


    //NAVEGACION
    //NUEVO TIPO de NOTA
    goToNueva( params:any = {} ){
        this.modelo_edit      = new Categoria();
        this.operacion_actual = 'Nueva';
        this.navController.navigateForward([ '/tabs/tab3/crear_categoria' ]);
    }

    goToEdit( id:number ){
        this.navController.navigateForward([ '/tabs/tab3/editar_categoria/' + id ]);
        this.operacion_actual = 'Editar';
        this.modelo_edit      = new Categoria();
        this.appUIUtilsService.presentLoading({ message: 'Consultando categoría...' });
    }

    goBack(){
        this.navController.pop();
    }

    //EXTRA DATA
    public estados_categoria:any = [];
    
}
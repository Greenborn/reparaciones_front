import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Nota } from '../models/nota';
import { ApiServiceBase } from './api.service.base';
import { AppUIUtilsService } from './app.ui.utils.service';
import { FormateoService } from './formateo.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateNotaService2 extends ApiServiceBase{

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
      private router:                Router,
      private formateoService:       FormateoService,
      private appUIUtilsService:     AppUIUtilsService,
    ) {
        super('private-nota', http, config);
        this.defSubscripcionesAPI();
    }

    //subscripciones
    private subscripciones:any = [];

    //modelos
    public modelo_edit:Nota;

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
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar obtener el listado de notas.');
            console.log(this.last_err);
        }}));

        //GET
        this.subscripciones.push( this.getOneOK.subscribe({ next:(p:any) => {
            this.modelo_edit = new Nota(p);
            this.modelo_edit.id = p.id; // SE AGREGA aca por que por un extraño motivo no se define en el modelo...
            
            //SE PASA A STRING PAR QUE EL OCMPONENTE DEL SELECTOR TOME BIEN SU VALOR ...
            this.modelo_edit.categoria_id = String(this.modelo_edit.categoria_id);
            this.modelo_edit.estado_id    = String(this.modelo_edit.estado_id);
            this.modelo_edit.obra_id      = String(this.modelo_edit.obra_id);
            this.modelo_edit.tipo_nota_id = String(this.modelo_edit.tipo_nota_id);

            //SE ACOMODA EL FORMATO DE LZA FECHA Y HORA PARA QUE SE MUESTRE CORRECTAMENTE EN EL SELECTOR
            let d = new Date(p['vencimiento']);
            this.modelo_edit.vencimiento      = this.formateoService.getNgbDatepickerArrayFDate(d);
            this.modelo_edit.vencimiento_hora = this.formateoService.getNgbTimePickerFDate(d);
            console.log(this.modelo_edit);console.log(d);

            //SE CARGA EL LISTADO DE IMAGENES
            this.nota_images = [];
            for(let c=0; c < this.modelo_edit.imagenes.length; c++){
                this.imgUrlToBase64(this.config.apiUrl(this.modelo_edit.imagenes[c].url), this.modelo_edit.imagenes[c], (p)=>{
                    this.nota_images.push({ file: p.base64, name:p.anydata.url, fromnota: true, id:p.anydata.id });
                });
            }

            //SE CARGA EL  LISTADO DE DOCUMENTOS
            this.nota_documentos = [];
            for(let c=0; c < p['documentos'].length; c++){
                this.nota_documentos.push(
                    { file:     '', 
                      name:     p['documentos'][c].nombre, 
                      fromnota: true, 
                      id:       p['documentos'][c].id, 
                      url:      p['documentos'][c].url 
                    });
            }

            this.appUIUtilsService.dissmisLoading();
        }}));

        //ERROR AL INTENTAR OBTENER Nota
        this.subscripciones.push( this.getOneKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar obtener la nota.');
            console.log(this.last_err);
        }}));

        //POST
        this.subscripciones.push( this.postedOK.subscribe({ next:(p:any) => {
                this.appUIUtilsService.displayAlert("Nuevo registro de Nota creado.");
                this.appUIUtilsService.dissmisLoading();
                this.getNotas();
                this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA NOTA
        this.subscripciones.push( this.postedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar crear la nota.');
            console.log(this.last_err);
        }}));

        //PUT 
        this.subscripciones.push( this.editedOK.subscribe({ next:(p:any) => {
                this.appUIUtilsService.displayAlert("Se ha modificado la nota.");
                this.appUIUtilsService.dissmisLoading();
                this.getNotas();
                this.goBack();
        }}));

        //ERROR AL INTENTAR CREAR UNA NUEVA NOTA
        this.subscripciones.push( this.editedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar modificar la nota.');
            console.log(this.last_err);
        }}));

        /// DELETE
        this.subscripciones.push( this.deletedOK.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading();
            this.appUIUtilsService.displayAlert('Nota eliminada correctamente.');
            this.getNotas();
        }}));

        this.subscripciones.push( this.deletedKO.subscribe({ next:(p:any) => {
            this.appUIUtilsService.dissmisLoading(); 
            this.getNotas();
            this.appUIUtilsService.displayAlert('Ocurrió un error al intentar eliminar la nota.');
        }}));

        //////////////////////////////
        ///// IMAGENES
        this.subscripciones.push( this.imageOnSuccess.subscribe({ next:(p:any) => {
            switch (p.extension){
                case 'pdf': case 'otf': case 'doc': case 'docx': case 'xls': case 'csv': case 'ott': case 'ods': case 'txt':
                    this.nota_documentos.push(p);
                break;

                case 'png': case 'jpg': case 'jpeg': case 'webp': case 'bmp':
                    this.nota_images.push(p);
                break;
            }
        }}));

        this.subscripciones.push( this.base64ConvertCallBack.subscribe({ next:(p) => {
            this.image_data = { file: p.base64 };
        }}));
    }


    // EDICIÓN DE NOTAS
    goToEdit( params ){
        this.operacion_actual = 'Editar';
        this.appUIUtilsService.presentLoading({ message: 'Consultando nota...' });
        this.modelo_edit      = undefined;
        this.get( params.nota_id, 'expand=imagenes,documentos');        
        this.router.navigate([  '/tabs/tab2/editar_nota/' + params.nota_id ]);
    }

    // NOTAS VENCIDAS
    public cant_vencidas:number   = 0;
    public notas_vencidas:any     = [];
    public filtro_vencidas:string = 'todas';

    obtenerNotasVencidas(){
        let date:any = new Date();
        date         = date.toISOString();

        let params = 'filter[vencimiento]=<' + date;
        this.getAll( { getParams:params, callback:() => {
            this.notas_vencidas = this.all;
            this.cant_vencidas  = this.all.length;
        } });
    }

    //NAVEGACION
    //NUEVA NOTA
    public nota_documentos:any = [];
    public nota_images:any     = [];
    goToNueva( params:any = {} ){
        this.nota_documentos = [];
        this.nota_images     = [];

        let ruta:string = '/tabs/tab2/crear_nota';
        if ( params.hasOwnProperty('obra_id') ){
            ruta += '/' + params.obra_id;
        }
        this.router.navigate([ ruta ]);
    }

    inic_modelo( params:any = {}){
        this.modelo_edit = new Nota( params );
    }

    goBack(){

    }

    //VISTA DE NOTAS
    public ver_nota_obra_nombre:string;
    public ver_nota_obra_id:number;
    public titulo_vista_notas:string = 'Notas de obra';

    goToNotas( params:any = {} ){ //OBTINE LAS NOTAS Y NAVEGA A LA VISTA DE NOTAS
        this.titulo_vista_notas = 'Notas de obra';

        if (params.hasOwnProperty('nombre_obra')){
            this.ver_nota_obra_nombre = params.nombre_obra;
            this.titulo_vista_notas += ' ' + this.ver_nota_obra_nombre; 
        }

        let ruta_vista:string = '/tabs/tab2/notas';
        if ( params.hasOwnProperty('obra_id') ){
            ruta_vista += '_obra/' + params.obra_id;
        }

        this.getNotas( params );
     
        this.router.navigate([ ruta_vista ]);
    }

    getNotas( params:any = {} ){ //HACE LA RECARGA DE NOTAS SIN OCUPARSE DE CUESTIONES DE LA VISTA
        let paramsGetAll:any = { getParams:'' };
        if (params.hasOwnProperty('getParams')){
            paramsGetAll.getParams = params.getParams;
        }

        if (params.hasOwnProperty('obra_id') && params.obra_id != undefined){
            this.ver_nota_obra_id = params.obra_id;
            paramsGetAll.getParams += '&filter[obra_id]='+this.ver_nota_obra_id;
        } 

        if (this.filtro_vencidas == 'vencidas') {
            let date:any            = new Date();
            date                    = date.toISOString();
            paramsGetAll.getParams += '&filter[vencimiento]=<' + date;
        }

        paramsGetAll.callback = () => {
            this.appUIUtilsService.dissmisLoading();
        };

        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de notas...' });
        this.getAll( paramsGetAll );
    }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { AppUIUtilsService } from './app.ui.utils.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiServiceBase {

    abstract all: any;
    abstract meta:any;
    abstract getAllOK:Subject<any>;
    abstract getAllKO:Subject<any>;
    abstract total_count:number;

    abstract one:any;
    abstract getOneOK:Subject<any>;
    abstract getOneKO:Subject<any>;

    abstract deleted_id:number;
    abstract deletedOK:Subject<any>;
    abstract deletedKO:Subject<any>;

    abstract edited_id:number;
    abstract editedOK:Subject<any>;
    abstract editedKO:Subject<any>;

    abstract post_id:number;
    abstract postedOK:Subject<any>;
    abstract postedKO:Subject<any>;

    abstract last_err:any;


    constructor(
        @Inject(String) private recurso:           string,
        protected               http:              HttpClient,
        protected               config:            ConfigService,
        protected               appUIUtilsService: AppUIUtilsService
    ) {

    }

    //PETICIONES A LA API

    public get( id:number, getParams:string = ''){
        this.http.get(this.config.apiUrl(`${this.recurso}/${id}?${getParams}`) ).subscribe(
            ok  => { 
                this.one = ok;  
                this.getOneOK.next(ok);  
            },
            err => { 
                this.last_err = err; 
                this.getOneKO.next(err); 
                this.showErrorMsg( err );
            }
        );
    }

    public getAll( params:any = {} ){
        let getParams:string = '';
        if (params.hasOwnProperty('getParams')){
            getParams = params.getParams; 
        }

        this.http.get(this.config.apiUrl(`${this.recurso}?${getParams}`) ).subscribe(
            (ok:any)  => { 
                this.all  = ok['items']; 
                this.meta = ok['_meta'];
                this.getAllOK.next(ok);  

                if ( params.hasOwnProperty('callback') ){ params.callback(); }
            },
            (err) => { 
                this.last_err = err; 
                this.showErrorMsg( err );
                this.getAllKO.next(err); 
            }
        );
    }

    public delete( id:number ){
        this.http.delete( `${this.config.apiUrl(this.recurso)}/${id}` ).subscribe(
            ok  => { this.deletedOK.next(ok);  },
            err => { 
                this.last_err = err; 
                this.showErrorMsg( err );
                this.deletedKO.next(err); 
            }
        );
    }

    public post( model:any, getParams: string = ''){
        this.http.post(`${this.config.apiUrl(this.recurso)}`, model ).subscribe(
            ok  => { this.postedOK.next(ok);  },
            err => { 
                this.showErrorMsg( err );
                this.last_err = err; 
                this.postedKO.next(err); 
            }
        );
    }

    public put( model:any, id:number ){
        this.http.put( `${this.config.apiUrl(this.recurso)}/${id}`, model ).subscribe(
            ok  => { this.editedOK.next(ok);  },
            err => { 
                this.showErrorMsg( err );
                this.last_err = err; 
                this.editedKO.next(err); 
            }
        );
    }

    //////////////// MANEJO DE ERRORES
    public display_error:boolean = true;
    public showErrorMsg( p:any ){
        if (!this.display_error){
            return false;
        }

        let texto_error:string = 'Ocurrió un error, reintente más tarde o consulte al soporte.';
        if (p.hasOwnProperty('error')){
            texto_error = p.error.message;
        }
        this.appUIUtilsService.displayAlert( texto_error, 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
    }

    //////////////// MANEJO DE ARCHIVOS

    public base64ConvertCallBack:Subject<any> = new Subject();
    public imgUrlToBase64(url, anydata:any = {}, callback = (p:any)=>{}) {
        let xhr = new XMLHttpRequest();
        let me = this;
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
            callback({base64:reader.result, anydata:anydata});
            me.base64ConvertCallBack.next({base64:reader.result, anydata:anydata});
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    abstract img_hfi_result;
    abstract image_data;
    abstract file_data;
    abstract file_data_extension;

    abstract imageOnSuccess:Subject<any>;
    abstract imageOnError:Subject<any>;
    handleFileInput(files: FileList) {
        let me     = this;
        let file   = files[0];
        let reader = new FileReader();
        
        this.img_hfi_result = null;
    
        if (!file) return;

        reader.readAsDataURL(file);
        reader.onload = function (i) {
        me.file_data_extension = String(file.name).split('.').pop();
        switch (me.file_data_extension){
            case 'pdf': case 'otf': case 'doc': case 'docx': case 'xls': case 'csv': case 'ott': case 'ods': case 'txt':
            me.file_data  =  { file: reader.result, name:file.name };
            break;

            case 'png': case 'jpg': case 'jpeg': case 'webp': case 'bmp':
            me.image_data =  { file: reader.result, name:file.name };
            break;
        }
        me.imageOnSuccess.next({ file: reader.result, name:file.name, extension: me.file_data_extension });
        };
        reader.onerror = function (error) {
            me.imageOnError.next(error);
            return false;
        };
    }
}

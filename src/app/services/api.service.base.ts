import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiServiceBase {

    public all: any =[];
    public meta:any;
    public getAllOK:Subject<any> = new Subject();
    public getAllKO:Subject<any> = new Subject();
    public total_count:number  = 0;

    public one:any;
    public getOneOK:Subject<any> = new Subject();
    public getOneKO:Subject<any> = new Subject();

    public deleted_id:number;
    public deletedOK:Subject<any> = new Subject();
    public deletedKO:Subject<any> = new Subject();

    public edited_id:number;
    public editedOK:Subject<any> = new Subject();
    public editedKO:Subject<any> = new Subject();

    public post_id:number;
    public postedOK:Subject<any> = new Subject();
    public postedKO:Subject<any> = new Subject();

    public last_err:any;


    constructor(
        @Inject(String) private recurso:  string,
        protected               http:     HttpClient,
        protected               config:   ConfigService,
    ) {

    }

    //PETICIONES A LA API

    public get( id:number, getParams:string = ''){
        this.http.get(this.config.apiUrl(`${this.recurso}/${id}?${getParams}`) ).subscribe(
            ok  => { 
                this.one = ok;  
                this.getOneOK.next(ok);  
            },
            err => { this.last_err = err; this.getOneKO.next(err); }
        );
    }

    public getAll( getParams:string = '' ){
        this.http.get(this.config.apiUrl(`${this.recurso}?${getParams}`) ).subscribe(
            ok  => { 
                this.all  = ok['items']; 
                this.meta = ok['_meta'];
                this.getAllOK.next(ok);  
            },
            err => { this.last_err = err; this.getAllKO.next(err); }
        );
    }

    public delete( id:number ){
        this.http.delete( `${this.config.apiUrl(this.recurso)}/${id}` ).subscribe(
            ok  => { this.deletedOK.next(ok);  },
            err => { this.last_err = err; this.deletedKO.next(err); }
        );
    }

    public post( model:any, getParams: string = ''){
        this.http.post(`${this.config.apiUrl(this.recurso)}`, model ).subscribe(
            ok  => { this.postedOK.next(ok);  },
            err => { this.last_err = err; this.postedKO.next(err); }
        );
    }

    public put( model:any, id:number ){
        this.http.put( `${this.config.apiUrl(this.recurso)}/${id}`, model ).subscribe(
            ok  => { this.editedOK.next(ok);  },
            err => { this.last_err = err; this.editedKO.next(err); }
        );
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

    public img_hfi_result = null;
    public image_data:any;
    public file_data:any;
    public file_data_extension:string;

    public imageOnSuccess:Subject<any> = new Subject();
    public imageOnError:Subject<any> = new Subject();
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

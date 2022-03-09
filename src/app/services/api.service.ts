import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiSerializedResponse } from '../models/ApiResponse';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService<T> {

  public all: any =[];
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

  

  
  protected fetchAllOnce: boolean = false;


  public getEd:any;
  public getEdOk:Subject<any> = new Subject();

  constructor(
    @Inject(String) private recurso: string,
    private  http: HttpClient,
    private config: ConfigService,
    // private _template: T
  ) { }

  abstract get template(): T;

  get<K = T>(id: number, getParams: string = ''): Observable<any> {  
    return this.http.get<K>(this.config.apiUrl(`${this.recurso}/${id}?${getParams}`) ).pipe(
      map((data) => {console.log(data);
        this.getEd = data;
        this.getEdOk.next(this.getEd);
        return data;
      }),catchError(error => {
        console.log(error);
        return throwError(error)
      })
    );
  }

  // https://www.yiiframework.com/doc/guide/2.0/en/rest-response-formatting
  getAll<K = T>(getParams: string = '', resource: string = null): Observable<K[]> {

    if (this.fetchAllOnce && this.all != undefined) {
      console.log('get all stored', this.all)
      return new Observable(suscriber => {
        suscriber.next(this.all as K[])
      })
    } else {
      const url = this.config.apiUrl(`${resource ?? this.recurso}?${getParams}`)
      // console.log('getting', url))
      return this.http.get<ApiSerializedResponse<K>>(url).pipe(
        map((data) => {
          console.log('get all', url, data)
          this.all = data.items;
          this.total_count = data._meta.totalCount;
          this.getAllOK.next(this.all);
          return data.items
        })
      );
    }

  }

  post<K = T>(model: K, id: number = undefined, getParams: string = ''): Observable<K> {
    console.log('posting', model, 'id: ', id)
    const headers = new HttpHeaders({ 'Content-Type':  'application/json' })
    return id == undefined ? 
      this.http.post<K>(
        this.config.apiUrl(`${this.recurso}?${getParams}`), 
        model,
        { headers }
      ) :
      this.http.put<K>(
        `${this.config.apiUrl(this.recurso)}/${id}?${getParams}`, 
        model,
        { headers }
      ) 
  }
  postFormData<K = T>(model: K, id: number = undefined, getParams: string = ''): Observable<K> {
    // const headers = new HttpHeaders({ 'Content-Type':  'application/json' })
    
    const f = new FormData()
    for ( let key in model ) {
      f.append(key, (model as any)[key])
    }
    // f.forEach(v => {
    //   console.log(v)
    // })
    console.log('posting form data', f, 'id: ', id)
    return id == undefined ? 
      this.http.post<K>(
        this.config.apiUrl(`${this.recurso}?${getParams}`), 
        f,
        // { headers }
      ) :
      this.http.put<K>(
        `${this.config.apiUrl(this.recurso)}/${id}?${getParams}`, 
        f,
        // { headers }
      ) 
  }

  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.config.apiUrl(this.recurso)}/${id}`
    )
  }

  put(model: any, id: number, recurso: string = null): Observable<any> {
    console.log('put', model, 'id: ', id)
    const headers = new HttpHeaders({ 'Content-Type':  'application/json' })
    return this.http.put(
      `${this.config.apiUrl(recurso ?? this.recurso)}/${id}`, 
      model,
      { headers }
    ) 
  }

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

}

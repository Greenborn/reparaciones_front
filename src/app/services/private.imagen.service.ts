import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { AppUIUtilsService } from './app.ui.utils.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateImagenService extends ApiService<any>{

  constructor( 
    http: HttpClient,
    config: ConfigService,
    private navController:           NavController,
    private configService:           ConfigService,
    private appUIUtilsService:       AppUIUtilsService
  ) {
      super('private-imagen', http, config)
     }
    
    get template(): any {
        return {
            
        }
    }

    get(id: number, getParams: string = ''): Observable<any> {  
      return super.get(id, getParams).pipe(
        map((data) => {
          this.imgUrlToBase64(this.configService.apiUrl(data.url), data);
        })
      );
    }

    public img_edit_id:number = 0;
    public accion:string = 'Nueva';
    
    public imagen_edit:any;
    public ImageLoaded:Subject<any> = new Subject();
    async goToEdit(params:any = {}){
        this.accion = 'Editar';
        this.imagen_edit         = params.img;
        this.imagen_edit.id_nota = params.id_nota;
        this.imagen_edit.name    = params.name;
        this.navController.navigateForward([ '/vista_imagen' ]);        
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateImagenService extends ApiService<any>{

  constructor( 
    http: HttpClient,
    config: ConfigService,
    private loadingController:       LoadingController,
    private navController:           NavController,
    private configService:           ConfigService
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
    public navigationOrigin = '/tabs';
    async goToEdit(params:any = {}){
      this.accion = 'Editar';
      if (params.hasOwnProperty('navigationOrigin')){
        this.navigationOrigin = params.navigationOrigin;
      }

      if (params.hasOwnProperty('page')){
        if (params.page.hasOwnProperty('thisPage'))
          this.navigationOrigin = params.page.thisPage;
        if (params.hasOwnProperty('img_id')){
          this.img_edit_id = params.img_id;
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          loading.present();
          let tmpSubj = this.get(this.img_edit_id).subscribe(
            ok => {  
              tmpSubj.unsubscribe(); 
              loading.dismiss();
            },
            err => { 
              tmpSubj.unsubscribe(); 
              loading.dismiss();
            }
          );
        }

      }
      this.navController.navigateForward([ '/vista_imagen' ]);
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateObrasService extends ApiService<any>{

    constructor( 
      http:                          HttpClient,
      config:                        ConfigService,
      private router:                Router,
      public  loadingController:     LoadingController,
    ) {
        super('private-obras', http, config);
    }
    
    get template(): any {
        return {
            
        }
    }

    public obra_edit_id:number        = 0;
    public obra_filter_enabled:string = 'enabled';
    recargarObras(page:any = null){
      let params:string = 'filter[habilitada]=1&expand=imagen';
      if (this.obra_filter_enabled == 'all'){
        params = 'expand=imagen';
      }

      if (page !== null){
        page.loadingEspecificData(this, params, '', 'Consultando Obras.');
        return true;
      }
      
      let tmpSubj = this.getAll(params).subscribe(
        ok => {  
          tmpSubj.unsubscribe(); 
        },
        err => { 
          tmpSubj.unsubscribe(); 
        }
      );
    }

    async goToEdit(id){
        this.obra_edit_id = id;
        this.router.navigate([ '/tabs/tab1/editar_obra' ]);
        const loading = await this.loadingController.create({ message: "Por favor espere..." });
        loading.present();
        let tmpSubj = this.get(this.obra_edit_id,'expand=imagen').subscribe(
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
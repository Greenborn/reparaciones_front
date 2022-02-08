import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateObrasService extends ApiService<any>{

  constructor( http: HttpClient,
    config: ConfigService) {
      super('private-obras', http, config)
     }
    
    get template(): any {
        return {
            
        }
    }

    public obra_edit_id:number        = 0;
    public obra_filter_enabled:string = 'enabled';
    recargarObras(){
      let params:string = 'filter[habilitada]=1&expand=imagen';
      if (this.obra_filter_enabled == 'all'){
        params = 'expand=imagen';
      }
      this.getAll(params).subscribe();
    }
}
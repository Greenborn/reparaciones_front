import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateNotaService extends ApiService<any>{

  constructor( http: HttpClient,
    config: ConfigService) {
      super('private-nota', http, config)
     }
    
    get template(): any {
        return {
            
        }
    }
}
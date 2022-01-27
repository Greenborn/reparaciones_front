import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PublicIncrementalStatsService extends ApiService<any>{

  constructor( http: HttpClient,
    config: ConfigService) {
      super('public-incremental-stats', http, config)
     }
    
    get template(): any {
        return {
            
        }
    }
}
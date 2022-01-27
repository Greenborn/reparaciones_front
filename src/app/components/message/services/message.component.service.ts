import { Injectable }        from '@angular/core';
import { Subject }  from 'rxjs';


import { MessageComponentConfig }   from '../models/message.component.config';

@Injectable({ providedIn: 'root' })
export class MessageComponentService {
  constructor(){

  }
  public dConfig:MessageComponentConfig = new MessageComponentConfig();

  public buttonsClass:string = 'btn-outline-info';

  public showMessage( params:any ){
    this.dConfig.content = params.content;
    if ( params.hasOwnProperty('title') ){ this.dConfig.title = params.title; }
    this.dConfig.messageShow = true;

    if ( params.hasOwnProperty('footerButtons') ){
      this.dConfig.footerButtons = params.footerButtons;
    } else {
      this.dConfig.footerButtons = [
        { buttonsClass: 'btn-outline-info', text: 'Aceptar' }
      ];
    }

  }

}

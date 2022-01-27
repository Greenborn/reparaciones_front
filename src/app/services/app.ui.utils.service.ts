//Este componente tiene como finalida centralizar todas las funciones comunes
//que utilizarían todas las páginas, como los mensajes de alerta, loadings, etc.
// Esto es asi, por que al parecer no es una practica buena extender páginas en Angular
import { Injectable }        from '@angular/core';

import { MessageComponentService } from '../components/message/services/message.component.service';

@Injectable({ providedIn: 'root' })
export class AppUIUtilsService {

  public loadingPresent = false;
  public messageText = '';
  public messageTitle = 'Atención';

  private errorGenericText = 'Ha ocurrido un error no especificado, por favor reintente luego.';

  constructor(
    private messageComponentService: MessageComponentService
  ) { }

  getAppTitle(){
    return 'AppCitas';
  }

  showMessage( msg:string ){
    this.messageComponentService.showMessage( { content:msg } );
  }

  showConfirm( msg:string, callbacks:any ){
    let footerButtons:any = [
      { buttonsClass: 'btn-outline-danger', text: 'Si', onClick:callbacks.yesCallback },
      { buttonsClass: 'btn-outline-info', text: 'No',   onClick:callbacks.noCallback },
    ];
    this.messageComponentService.showMessage( { content:msg, footerButtons:footerButtons } );
  }

  dismissLoading(){
    this.loadingPresent = false;
  }

  presentLoading(d=0){
    this.loadingPresent = true;
  }

  getMessageFErrors( errors:any ){
    let out:string = '';
    for (let c=0; c < errors.length; c++){
      out += errors[ c ] + '\n\r';
    }
    return out;
  }

  errMsg( response:any ){
    if ( response.hasOwnProperty( 'error' ) ){
      if ( response.error.hasOwnProperty( 'message' ) ){
        this.showMessage( response.error.message );
      } else {
        this.showMessage( this.errorGenericText );
      }
    }
  }

}

import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppUIUtilsService {

    constructor(
        private alertCtrl:         AlertController,
        public loadingController: LoadingController
    ) { }

    async displayAlert(message: string, header:string = 'Info') {
        (await this.alertCtrl.create({
          header: header,
          message,
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        })).present()
    }


    public loadingMsg:string;
    public loadingPresent:boolean = false;
    presentLoading( params ) {
        this.loadingPresent = true;
        this.loadingMsg = params.message;
    }
    
    dissmisLoading() {
        this.loadingPresent = false;
    }
}
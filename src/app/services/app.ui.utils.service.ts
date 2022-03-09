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

    private loading:any = null;
    async presentLoading( loadingParams ){
        //si ya hay un loading instanciado lo cerramos y reemplazom por el nuevo
        if (this.loading !== null){
            this.loading.dismiss();
            this.loading = null;
        }
        this.loading = await this.loadingController.create( loadingParams );
        this.loading.present();
    }

    dissmisLoading(){ 
        if (this.loading !== null){
            this.loading.dismiss();
            this.loading = null;
        }
    }
}
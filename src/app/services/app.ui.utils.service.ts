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

    public messagePresent:boolean = false;
    public message:string;
    public messageHeader:string;
    public messageButtons:any = [];
    public displayAlert(message: string, header:string = 'Info', buttons:any = []) {
        this.messagePresent = true;
        this.message        = message;
        this.messageHeader  = header;
        this.messageButtons = buttons;
    }

    public dissmissAlert(){
        this.messagePresent = false;
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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

import { ObrasMenuComponent } from '../obras.menu/obras.menu.component';

@Component({
  selector: 'app-obras-list',
  templateUrl: './obras.list.component.html',
  styleUrls: ['./obras.list.component.scss'],
})
export class ObrasListComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:       AlertController,
    public  loadingController:     LoadingController,
    public  ref:                   ChangeDetectorRef,
    public  privateObrasService:   PrivateObrasService,
    private router:                Router,
    public  configService:         ConfigService,
    public modalController:        ModalController,
    public  authService:           AuthService,
  ) { 
    super(alertController, loadingController, ref, authService);
  }

    public listadoObras:any = [];
    private listadoObraSubj:any;

    async modal_menu(obra:any){
        let modal:any = await this.modalController.create({
            component: ObrasMenuComponent,
            componentProps: {
            'obra':  obra,
            'modal': this.modalController
            },
            
        });
        modal.onDidDismiss().then(() => {
         
        });
        return await modal.present();
    }

    ngOnInit() {
        this.listadoObraSubj = this.privateObrasService.getAllOK.subscribe(
            { next:(p:any) => {
                this.listadoObras = this.privateObrasService.all;
                this.ref.detectChanges();
            } }
        );
        setTimeout(() => {
            this.consultar(this.privateObrasService.obra_filter_enabled);
        }, 500);
    }

    nueva_obra(){
        this.privateObrasService.goToCreate();
    }

    consultar(v:string){
        this.privateObrasService.obra_filter_enabled = v;
        this.privateObrasService.recargarObras();
    }


    ngOnDestroy(){
        this.listadoObraSubj.unsubscribe();
    }

}

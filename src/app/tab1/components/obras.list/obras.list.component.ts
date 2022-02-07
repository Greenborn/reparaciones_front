import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { ConfigService } from 'src/app/services/config.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

import { Tab1Service } from '../../tab1.service';
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
    private privateObrasService:   PrivateObrasService,
    private router:                Router,
    private tab1Service:           Tab1Service,
    public  configService:         ConfigService,
    public modalController:        ModalController
  ) { 
    super(alertController, loadingController, ref);
  }

  async modal_menu(obra:any){
    let modal = await this.modalController.create({
      component: ObrasMenuComponent,
      componentProps: {
        'obra':  obra,
        'modal': this.modalController
      }
    });
    return await modal.present();
  }

  public listado_obras:any = [];
  public obra_filter_enabled:string = 'enabled';

  private recargarObrasSubs:any;

  ngOnInit() {
    if (this.recargarObrasSubs == undefined){
      this.recargarObrasSubs = this.tab1Service.recargarObras.subscribe({ next:() => {
        this.consultar_habilitadas();
      }});
    }
    this.tab1Service.recargarObras.next();
  }

  nueva_obra(){
    this.router.navigate([ '/tabs/tab1/crear_obra' ]);
  }

  editar_obra(obra:any){
    this.tab1Service.obra_edit_id = obra.id;
    this.router.navigate([ '/tabs/tab1/editar_obra' ]);
  }

  consultar_habilitadas(){
    this.loadingEspecificData(this.privateObrasService, 'filter[habilitada]=1&expand=imagen',   'listado_obras', 'Consultando obras.');
  }

  consultar_todas(){
    this.loadingEspecificData(this.privateObrasService, 'expand=imagen',   'listado_obras', 'Consultando obras.');
  }

  ngOnDestroy(){
    this.recargarObrasSubs.unsubscribe();
  }

}

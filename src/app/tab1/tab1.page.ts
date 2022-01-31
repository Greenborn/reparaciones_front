import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from '../models/ApiConsumer';
import { FormateoService } from '../services/formateo.service';
import { PrivateObrasService } from '../services/private.obras.service';
import { Tab2Service } from '../tab2/tab2.service';
import { Tab1Service } from './tab1.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Tab1Page  extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:       AlertController,
    public  loadingController:     LoadingController,
    public  formateoService:       FormateoService,
    private privateObrasService:   PrivateObrasService,
    private router:                Router,
    private tab1Service:           Tab1Service,
    private tab2Service:           Tab2Service,
    public ref:                    ChangeDetectorRef,
  ) {
    super(alertController, loadingController, ref);
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
    this.loadingEspecificData(this.privateObrasService, 'filter[habilitada]=1',   'listado_obras', 'Consultando obras.');
  }

  consultar_todas(){
    this.loadingEspecificData(this.privateObrasService, '',   'listado_obras', 'Consultando obras.');
  }

  nueva_nota(obra){
    this.tab2Service.nueva_nota_obra_id = obra.id;
    this.tab2Service.navigationOrigin = '/tabs/tab1';
    this.router.navigate([ '/tabs/tab2/crear_nota' ]);
  }

  ver_notas(obra:any){
    this.tab2Service.ver_nota_obra_id     = obra.id;
    this.tab2Service.ver_nota_obra_nombre = obra.nombre_alias;
    this.router.navigate([ '/tabs/tab2/notas' ]);
  }

  async eliminar_obra(obra:any){
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Está por eliminar la obra "' + obra.nombre_alias + '" y se perderán sus notas asociadas ¿desea continuar?.',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      }, {
        text: 'Si',
        cssClass: 'danger',
        handler: () => {
          this.borrar_obra(obra);
        }
      }]
    });
    await alert.present();
  }

  async borrar_obra(obra:any){
    const loading = await this.loadingController.create({ message: 'Borrando obra: ' + obra.nombre_alias});
    await loading.present();
    this.privateObrasService.delete(obra.id).subscribe(
      ok => {
        loading.dismiss();
        this.obra_filter_enabled = 'enabled';
        this.tab1Service.recargarObras.next();
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar eliminar la obra: ' + obra.nombre_alias);
      }
    );
  }

  async desabilitar_obra(obra:any){
    obra.habilitada = 0;
    const loading = await this.loadingController.create({ message: 'Desabilitando obra: ' + obra.nombre_alias});
    await loading.present();

    this.privateObrasService.put(obra,obra.id).subscribe(
      ok => {
        loading.dismiss();
        this.obra_filter_enabled = 'enabled';
        this.tab1Service.recargarObras.next();
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar editar la obra: ' + obra.nombre_alias);
      }
    );
  }

  async habilitar_obra(obra:any){
    obra.habilitada = 1;
    const loading = await this.loadingController.create({ message: 'Habilitando obra: ' + obra.nombre_alias});
    await loading.present();

    this.privateObrasService.put(obra,obra.id).subscribe(
      ok => {
        loading.dismiss();
        this.obra_filter_enabled = 'enabled';
        this.tab1Service.recargarObras.next();
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar editar la obra: ' + obra.nombre_alias);
      }
    );
  }

  ngOnDestroy(){
    this.recargarObrasSubs.unsubscribe();
  }

}

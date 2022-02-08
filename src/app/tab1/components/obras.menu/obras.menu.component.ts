import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-obras.menu',
  templateUrl: './obras.menu.component.html',
  styleUrls: ['./obras.menu.component.scss'],
})
export class ObrasMenuComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  @Input() obra: string;
  @Input() modal: any;

  constructor(
    private alertController:       AlertController,
    public  loadingController:     LoadingController,
    public  ref:                   ChangeDetectorRef,

    private router:                Router,
    
    private privateObrasService:   PrivateObrasService,
    private privateNotaService:    PrivateNotaService
  ) { 
    super(alertController, loadingController, ref);
  }

  ngOnInit() {

  }

  volver(){
    this.modal.dismiss();
  }

  nueva_nota(obra){
    this.privateNotaService.goToNueva({ page:this, obra_id:obra.id, navigationOrigin:'/tabs/tab1' });
    this.volver();
  }

  editar_obra(obra:any){
    this.privateObrasService.goToEdit(obra.id);
    this.volver();
  }

  ver_notas(obra:any){
    this.privateNotaService.goToNotas({ page:this, obra:obra.id, nombre_obra:obra.nombre_alias });
    this.volver();
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
        this.privateObrasService.recargarObras(this);
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar eliminar la obra: ' + obra.nombre_alias);
      }
    );
    this.volver();
  }

  async desabilitar_obra(obra:any){
    obra.habilitada = 0;
    const loading = await this.loadingController.create({ message: 'Desabilitando obra: ' + obra.nombre_alias});
    await loading.present();

    this.privateObrasService.put(obra,obra.id).subscribe(
      ok => {
        loading.dismiss();
        this.privateObrasService.recargarObras(this);
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar editar la obra: ' + obra.nombre_alias);
      }
    );
    this.volver();
  }

  async habilitar_obra(obra:any){
    obra.habilitada = 1;
    const loading = await this.loadingController.create({ message: 'Habilitando obra: ' + obra.nombre_alias});
    await loading.present();

    this.privateObrasService.put(obra,obra.id).subscribe(
      ok => {
        loading.dismiss();
        this.privateObrasService.recargarObras(this);
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar editar la obra: ' + obra.nombre_alias);
      }
    );
    this.volver();
  }

}

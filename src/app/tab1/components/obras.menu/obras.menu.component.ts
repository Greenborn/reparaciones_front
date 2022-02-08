import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { PrivateObrasService } from 'src/app/services/private.obras.service';
import { Tab2Service } from 'src/app/tab2/tab2.service';

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

    private tab2Service:           Tab2Service,
    private router:                Router,
    
    private privateObrasService:   PrivateObrasService,
  ) { 
    super(alertController, loadingController, ref);
  }

  ngOnInit() {

  }

  volver(){
    this.modal.dismiss();
  }

  nueva_nota(obra){
    this.tab2Service.nueva_nota_obra_id = obra.id;
    this.tab2Service.navigationOrigin = '/tabs/tab1';
    this.router.navigate([ '/tabs/tab2/crear_nota' ]);
    this.volver();
  }

  editar_obra(obra:any){
    this.privateObrasService.goToEdit(obra.id);
    this.volver();
  }

  ver_notas(obra:any){
    this.tab2Service.ver_nota_obra_id     = obra.id;
    this.tab2Service.ver_nota_obra_nombre = obra.nombre_alias;
    this.router.navigate([ '/tabs/tab2/notas' ]);
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

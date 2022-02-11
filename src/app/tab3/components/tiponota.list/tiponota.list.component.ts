import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateTipoNotaService } from 'src/app/services/private.tipo.nota.service';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-tiponota-list',
  templateUrl: './tiponota.list.component.html',
  styleUrls: ['./tiponota.list.component.scss'],
})
export class TiponotaListComponent extends ApiConsumer  implements OnInit, OnDestroy {

  public tipo_notas:any = [];

  constructor(
    public  loadingController:        LoadingController,
    private alertController:          AlertController,
    public  ref:                      ChangeDetectorRef,
    private privateTipoNotaService:   PrivateTipoNotaService,
    private router:                   Router,
    public  authService:              AuthService,
    private tab3Service:              Tab3Service,
  ) {
    super(alertController, loadingController, ref, authService);
  }
  
  ngOnInit() {
    this.load_data();
  }

  load_data(){
    this.loadingEspecificData(this.privateTipoNotaService, '',   'tipo_notas', 'Consultando tipos de notas.');
  }
  
  nuevo_tipo_nota(){
    this.router.navigate([ '/tabs/tab3/crear_tipo_nota' ]);
  }

  editar_tipo_nota(tipo_nota){
    this.tab3Service.tipo_nota_edit_id = tipo_nota.id;
    this.router.navigate([ '/tabs/tab3/editar_tipo_nota' ]);
  }

  async eliminar_tipo_nota(tipo_nota){
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Está por eliminar el tipo de nota "' + tipo_nota.nombre + '" ¿desea continuar?.',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      }, {
        text: 'Si',
        cssClass: 'danger',
        handler: () => {
          this.borrar_tipo_nota(tipo_nota);
        }
      }]
    });
    await alert.present();
  }

  async borrar_tipo_nota(tipo_nota){
    const loading = await this.loadingController.create({ message: 'Borrando tipo de nota: ' + tipo_nota.nombre});
    await loading.present();
    this.privateTipoNotaService.delete(tipo_nota.id).subscribe(
      ok => {
        loading.dismiss();
        this.load_data();
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar eliminar: ' + tipo_nota.nombre + '¿El tipo de nota tiene notas asociadas?');
      }
    );
  }

}

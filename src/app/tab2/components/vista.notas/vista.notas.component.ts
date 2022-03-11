import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateNotaService2 } from 'src/app/services/private.nota.service2';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-vista-notas',
  templateUrl: './vista.notas.component.html',
  styleUrls: ['./vista.notas.component.scss'],
})
export class VistaNotasComponent  implements OnInit, OnDestroy  {

  public titulo:string = "";

  private router_subs:any;
  public obra_id:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    private router:                      Router,
    public  privateNotaService:          PrivateNotaService2,
    public  privateObrasService:         PrivateObrasService,
    private appUIUtilsService:           AppUIUtilsService,
  ) {
  }

    ngOnInit() {
        if (this.router_subs == undefined){
            
        }

        //SE RECARGA EL LISTADO DE NOTAS
        this.privateNotaService.getNotas({ 
            getParams:   'expand=categoria,obra,tipoNota' 
        });

        //NOS ASEGURAMOS DE CARGAR EL LISTADO DE OBRAS
        //SOLO LAS QUE ESTAN HABILITADAS
        if (this.privateObrasService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: 'Consultando listado de obras...' });

            this.privateObrasService.getAll({
                getParams: 'filter[habilitada]=1',
                callback: ()=>{
                    this.appUIUtilsService.dissmisLoading();
                }
            });
        }
    }

    ngOnDestroy(){
    }

    getBgColor(nota:any){
        if (!nota.hasOwnProperty('categoria')){
            return '#FFF';
        }
        if (!nota.categoria.hasOwnProperty('color')){
            return '#FFF';
        }
        return nota.categoria.color;
    }

    nombreObra(nota){
        if (!nota.hasOwnProperty('obra')){
            return '';
        }
        return nota.obra.nombre_alias;
    }
  

    consultar( filtro:string ){
        this.privateNotaService.filtro_vencidas = filtro;
        this.privateNotaService.getNotas({ 
            getParams:   'expand=categoria,obra,tipoNota' 
        });
    }

    obra_seleccionada(){
        let nombre_obra = '';
        for (let c=0; c < this.privateObrasService.all.length; c++){
            if (this.privateObrasService.all[c].id == this.obra_id){
                nombre_obra = this.privateObrasService.all[c].nombre_alias;
                break;
            }
        }
        this.privateNotaService.getNotas({
            obra:         this.obra_id, 
            nombre_obra:  nombre_obra,
            getParams:   'expand=categoria,obra,tipoNota'
        });
    }

    goBack(){
        this.router.navigate([ '/tabs/tab1' ]);
    }

    editar_nota(nota){
    //[REFACTORIZAR]this.privateNotaService.goToEdit({ page:this, nota_id:nota.id, navigationOrigin:'/tabs/tab2' });
    }

    nueva_nota(){
        this.privateNotaService.goToNueva({ navigationOrigin:'/tabs/tab2' });
    }

  async eliminar_nota(nota){
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Está por eliminar la nota "' + nota.nota + '" y se perderán sus archivos asociados ¿desea continuar?.',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      }, {
        text: 'Si',
        cssClass: 'danger',
        handler: () => {
          this.borrar_nota(nota);
        }
      }]
    });
    await alert.present();
  }

  async borrar_nota(nota){
    const loading = await this.loadingController.create({ message: 'Borrando nota: ' + nota.nota});
    await loading.present();
   //[REFACTORIZAR] this.privateNotaService.delete(nota.id).subscribe(
      //[REFACTORIZAR]ok => {
        //[REFACTORIZAR]loading.dismiss();
        //[REFACTORIZAR]this.privateNotaService.goToNotas({ page:this });
      //[REFACTORIZAR]},
      //[REFACTORIZAR]err => {
        //[REFACTORIZAR]loading.dismiss();
        //[REFACTORIZAR]this.displayAlert('Ocurrió un error al intentar eliminar la nota: ' + nota.nota);
      //[REFACTORIZAR]}
    //[REFACTORIZAR]);
  }
}

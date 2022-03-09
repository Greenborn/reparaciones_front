import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateDocumentoService } from 'src/app/services/private.documento.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-vista-notas',
  templateUrl: './vista.notas.component.html',
  styleUrls: ['./vista.notas.component.scss'],
})
export class VistaNotasComponent extends ApiConsumer  implements OnInit, OnDestroy  {

  public titulo:string = "Notas de obra";

  private router_subs:any;
  public obra_id:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    public  authService:                 AuthService,
    private router:                      Router,
    public  privateNotaService:          PrivateNotaService,
    public  privateObrasService:         PrivateObrasService,
    private privateDocumentoService:     PrivateDocumentoService
  ) {
    super(alertController, loadingController, ref, authService);
  }

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('notas') != -1) {
          this.titulo = "Notas de obra";
          if (this.privateNotaService.ver_nota_obra_id != undefined){
            this.titulo = "Notas de obra "+ this.privateNotaService.ver_nota_obra_nombre;
          }

          //[REFACTORIZAR] if (this.privateObrasService.all != undefined && this.privateObrasService.all.length == 0){
            //[REFACTORIZAR] this.privateObrasService.recargarObras(this);
          //[REFACTORIZAR] }
        } 
      });
    }

    this.privateNotaService.goToNotas({ page:this });
  }

  clear(){
    this.obra_id = undefined;
    this.privateNotaService.goToNotas({ page:this });
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
  

  consultar(filtro){
      this.privateNotaService.filtro_vencidas = filtro;
      this.privateNotaService.goToNotas({ page:this });
  }

  obra_seleccionada(){
    console.log(this.obra_id);
    let nombre_obra = '';
   //[REFACTORIZAR]  for (let c=0; c < this.privateObrasService.all.length; c++){
      //[REFACTORIZAR] if (this.privateObrasService.all[c].id == this.obra_id){
        //[REFACTORIZAR] nombre_obra = this.privateObrasService.all[c].nombre_alias;
        //[REFACTORIZAR] break;
      //[REFACTORIZAR] }
    //[REFACTORIZAR] }
    //[REFACTORIZAR] this.privateNotaService.goToNotas({ page:this, obra:this.obra_id, nombre_obra:nombre_obra });
  }

  goBack(){
    this.router.navigate([ '/tabs/tab1' ]);
  }

  editar_nota(nota){
    this.privateNotaService.goToEdit({ page:this, nota_id:nota.id, navigationOrigin:'/tabs/tab2' });
  }

  nueva_nota(){
    this.privateNotaService.goToNueva({ page:this, navigationOrigin:'/tabs/tab2' });
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
    this.privateNotaService.delete(nota.id).subscribe(
      ok => {
        loading.dismiss();
        this.privateNotaService.goToNotas({ page:this });
      },
      err => {
        loading.dismiss();
        this.displayAlert('Ocurrió un error al intentar eliminar la nota: ' + nota.nota);
      }
    );
  }
}

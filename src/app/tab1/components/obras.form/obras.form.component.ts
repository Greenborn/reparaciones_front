import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Obra } from 'src/app/models/obra';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-obras.form',
  templateUrl: './obras.form.component.html',
  styleUrls: ['./obras.form.component.scss'],
})
export class ObrasFormComponent extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private router:                      Router,
    private privateObrasService:         PrivateObrasService,
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private configService:               ConfigService,
    public  authService:                 AuthService,
  ) {
    super(alertController, loadingController, ref, authService);
  }

  public model:Obra    = new Obra();
  public accion:string = 'Nueva';
  public file_field:any;

  private router_subs:any;
  private imageOnSuccessSubj:any;
  private base64ConvertCallBackSubj:any;
  private getedSubj:any;

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        this.image_data = null;
        if (event.url.search('crear_obra') != -1) {
          this.accion = 'Nueva';
          this.model = new Obra();
          this.eliminar_imagen();
        } else if (event.url.search('editar_obra') != -1){
          this.accion = 'Editar';
          this.eliminar_imagen();
        }
      });
    }

    if (this.getedSubj == undefined){
      this.privateObrasService.getEdOk.subscribe({ next:(p:any) => {
        this.model = p;
        if (this.model['imagen']!= null){
          this.privateObrasService.imgUrlToBase64(this.configService.apiUrl(this.model[`imagen`].url));
        } 
      }});
    }

    if (this.imageOnSuccessSubj == undefined){
      this.imageOnSuccessSubj = this.imageOnSuccess.subscribe({ next:(p:any) => {
        this.model.imagen_data = this.image_data;
      }});
    }

    if (this.base64ConvertCallBackSubj == undefined){
      this.base64ConvertCallBackSubj = this.privateObrasService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.image_data = { file: p.base64 };
      }});
    }
  }

  eliminar_imagen(){
    this.image_data        = undefined;
    this.model.imagen_data = undefined;
    this.file_field        = '';
  }

  OnDestroy(){
    this.router_subs.unsubscribe();
    this.imageOnSuccessSubj.unsubscribe();
    this.base64ConvertCallBackSubj.unsubscribe();
    this.getedSubj.unsubscribe();
  }

  goBack(){
    this.router.navigate([ '/tabs/tab1' ]);
  }

  async ingresar(){
    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    loading.present();
    if (this.accion == 'Nueva'){
      this.privateObrasService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Obra creado.");
          loading.dismiss();
          this.privateObrasService.recargarObras(this);
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateObrasService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado la obra.");
          loading.dismiss();
          this.privateObrasService.recargarObras(this);
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    }
    
  }
}

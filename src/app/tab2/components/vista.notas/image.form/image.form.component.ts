import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Imagen } from 'src/app/models/imagen';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';
import { HerramientaConfig } from './herramienta.config.model';
import { LienzoModel } from './lienzo.model';

@Component({
  selector: 'app-image.form',
  templateUrl: './image.form.component.html',
  styleUrls: ['./image.form.component.scss'],
})
export class ImageFormComponent  implements OnInit, OnDestroy {

  constructor(
    private privateImageService:         PrivateImagenService,
    private navController:               NavController,
    public appUIUtilsService:           AppUIUtilsService, 
  ) { 
  }

  private getAllSubj:any = [];
  public imagen:any;
  public model = new Imagen();

  public herramientas:HerramientaConfig;
  public lienzo:LienzoModel;

  ngOnInit() {
    
    this.herramientas = new HerramientaConfig({page:this});
    this.lienzo = new LienzoModel(
      { areaEdicion:'areaEdicion', canvasCont:'canvasCont', herramientas:this.herramientas, fps:30 }
    );
    this.herramientas.lienzo = this.lienzo;

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(this.privateImageService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagen = { file: p.base64, name:p.anydata.url, id:p.anydata.id, url:p.anydata.url, id_nota:p.anydata.id_nota };

        this.lienzo.loadImage( this.imagen );
      }}));
    }
  }

  ngOnDestroy(){

  }

  goBack(){
    this.navController.setDirection( 'back' );
  }

  async ingresar(){
    this.model.base64_edit = this.lienzo.areaEdicion.toDataURL("image/jpeg");
    this.model.url         = this.imagen.url;
    this.model.id_nota     = this.imagen.id_nota;
    this.model.id          = this.imagen.id;

    this.appUIUtilsService.presentLoading({ message:  "Guardando cambios..." });
    this.privateImageService.put(this.model, this.model.id).subscribe(
      ok => {
        this.appUIUtilsService.displayAlert("Imagen guardada correctamente.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        this.appUIUtilsService.dissmisLoading();
        this.goBack();
      },
      err => {
        this.appUIUtilsService.displayAlert("Ha ocurrido un error!", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
        this.appUIUtilsService.dissmisLoading();
      }
    );
  }
  
  cambiar_ancho_trazo(){
    if (this.herramientas.ancho_trazo < 1){
      this.herramientas.ancho_trazo = 1;
    } else if (this.herramientas.ancho_trazo > 10) {
      this.herramientas.ancho_trazo = 10;
    }
  }

  reset(){
    this.lienzo.loadImage( this.imagen );
  }
}

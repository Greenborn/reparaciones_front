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
  
  public model = new Imagen();

  public herramientas:HerramientaConfig;
  public lienzo:LienzoModel;

  ngOnInit() {
    
    this.herramientas = new HerramientaConfig({page:this});
    this.lienzo = new LienzoModel(
      { areaEdicion:'areaEdicion', canvasCont:'canvasCont', herramientas:this.herramientas, fps:30 }
    );
    this.herramientas.lienzo = this.lienzo;
    
    if (this.privateImageService.imagen_edit !== undefined){
        this.lienzo.loadImage( this.privateImageService.imagen_edit );
    } else {
        this.appUIUtilsService.displayAlert("No se pudo cargar la imagen.", 'Atención', [
            { text:'Aceptar', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } }
        ]);
    }
  }

    ngOnDestroy(){
        for (let c=0; c < this.getAllSubj.length; c++){
            this.getAllSubj[c].unsubscribe();
        }
    }

  goBack(){
    this.navController.back();
  }

  async ingresar(){
    this.model.base64_edit = this.lienzo.areaEdicion.toDataURL("image/jpeg");
    this.model.url         = this.privateImageService.imagen_edit.url;
    this.model.id_nota     = this.privateImageService.imagen_edit.id_nota;
    this.model.id          = this.privateImageService.imagen_edit.id;
    this.model.name        = this.privateImageService.imagen_edit.name;
console.log(this.model.url);
    this.appUIUtilsService.presentLoading({ message:  "Guardando cambios..." });
    if (this.privateImageService.imagen_edit.id == -1 || this.privateImageService.imagen_edit.id === undefined){
        this.model.url = '-';
        this.privateImageService.post(this.model).subscribe(
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
    } else {
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

    
  }
  
  cambiar_ancho_trazo(){
    if (this.herramientas.ancho_trazo < 1){
      this.herramientas.ancho_trazo = 1;
    } else if (this.herramientas.ancho_trazo > 10) {
      this.herramientas.ancho_trazo = 10;
    }
  }

  reset(){
    this.lienzo.loadImage( this.privateImageService.imagen_edit );
  }
}

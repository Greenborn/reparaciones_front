import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';
import { HerramientaConfig } from './herramienta.config.model';

@Component({
  selector: 'app-image.form',
  templateUrl: './image.form.component.html',
  styleUrls: ['./image.form.component.scss'],
})
export class ImageFormComponent extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    private privateImageService:         PrivateImagenService,
    public  authService:                 AuthService,
  ) { 
    super(alertController, loadingController, ref, authService);    
  }

  private getAllSubj:any = [];
  public imagen:any;
  public canvas_img:any;

  public herramientas:any = new HerramientaConfig();

  public areaEdicion:any;
  public context: any;

  ngOnInit() {
    this.areaEdicion = document.getElementById('areaEdicion');
    this.context     = this.areaEdicion.getContext('2d');

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(this.privateImageService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagen = { file: p.base64, name:p.anydata.url, id:p.anydata.id };

        this.canvas_img = new Image();
        let me = this;
        this.canvas_img.onload = function() {
            me.areaEdicion.setAttribute("width", me.canvas_img.width);
            me.areaEdicion.setAttribute("height", me.canvas_img.height);
            me.context.drawImage(me.canvas_img, 0, 0);
            console.log();
        };
        this.canvas_img.src = this.imagen.file;

      }}));
    }
  }

  goBack(){
    this.router.navigate([ this.privateImageService.navigationOrigin ]);
  }

  ingresar(){
    
  }
}

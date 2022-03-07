import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Imagen } from 'src/app/models/imagen';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { HerramientaConfig } from './herramienta.config.model';
import { LienzoModel } from './lienzo.model';

@Component({
  selector: 'app-image.form',
  templateUrl: './image.form.component.html',
  styleUrls: ['./image.form.component.scss'],
})
export class ImageFormComponent extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public  ref:                         ChangeDetectorRef,
    private router:                      Router,
    private privateImageService:         PrivateImagenService,
    private privateNotaService:          PrivateNotaService,
    public  authService:                 AuthService,
  ) { 
    super(alertController, loadingController, ref, authService);    
  }

  private getAllSubj:any = [];
  public imagen:any;
  public model = new Imagen();

  public herramientas:any = new HerramientaConfig();
  public lienzo:LienzoModel;

  ngOnInit() {
    
    this.lienzo = new LienzoModel(
      { areaEdicion:'areaEdicion', canvasCont:'canvasCont', herramientas:this.herramientas, fps:30 });

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(this.privateImageService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagen = { file: p.base64, name:p.anydata.url, id:p.anydata.id, url:p.anydata.url, id_nota:p.anydata.id_nota };

        this.lienzo.loadImage( this.imagen );
      }}));
    }
  }

  goBack(){
    this.privateNotaService.goToEdit({ page:this, nota_id: this.imagen.id_nota });
    this.router.navigate([ this.privateImageService.navigationOrigin ]);
  }

  async ingresar(){
    this.model.base64_edit = this.lienzo.areaEdicion.toDataURL("image/jpeg");
    this.model.url         = this.imagen.url;
    this.model.id_nota     = this.imagen.id_nota;
    this.model.id          = this.imagen.id;
    const loading = await this.loadingController.create({ message: "Guardando cambios..." });
    loading.present();
    this.privateImageService.put(this.model, this.model.id).subscribe(
      ok => {
        super.displayAlert("Imagen guardada correctamente.");
        loading.dismiss();
        this.goBack();
      },
      err => {
        super.displayAlert("Ha ocurrido un error!");
        loading.dismiss();
      }
    );
  }

  mouse_down(){
    this.herramientas.mouse_down = true;
    this.herramientas.mouse_ant = [];
  }

  mouse_up(){
    this.herramientas.mouse_down = false;
    this.herramientas.mouse_ant = [];
  }

  
  recorte(){
    this.herramientas.herramienta_seleccionada = 'recorte';
    this.herramientas.pincel_btn_color  = 'medium';
    this.herramientas.recorte_btn_color = 'primary';
    this.herramientas.mover_btn_color   = 'medium';
    this.herramientas.cursor            = "crosshair";

    //se dibuja la selección
    this.herramientas.x1 = 1;
    this.herramientas.y1 = 1;
    this.herramientas.x2 = this.lienzo.imageWidth;
    this.herramientas.y2 = this.lienzo.imageHeigth;

    this.lienzo.copiaImageData(this.lienzo.imageDataPreRecorte, this.lienzo.imageData);
  }

  

  pincel(){
    if (this.lienzo.imageDataPreRecorte.length != 0){
      this.lienzo.copiaImageData(this.lienzo.imageData, this.lienzo.imageDataPreRecorte);
      this.lienzo.imagenActualizar = true;
    }

    this.herramientas.herramienta_seleccionada = 'pincel';
    this.herramientas.pincel_btn_color  = 'primary';
    this.herramientas.recorte_btn_color = 'medium';
    this.herramientas.mover_btn_color   = 'medium';
    this.herramientas.cursor            = "url('./assets/img/pencil.png'), default";
  }

  mover(){
    if (this.lienzo.imageDataPreRecorte.length != 0){
      this.lienzo.copiaImageData(this.lienzo.imageData, this.lienzo.imageDataPreRecorte);
      this.lienzo.imagenActualizar = true;
    }

    this.herramientas.herramienta_seleccionada = 'mover';
    this.herramientas.mover_btn_color   = 'primary';
    this.herramientas.recorte_btn_color = 'medium';
    this.herramientas.pincel_btn_color  = 'medium';
    this.herramientas.cursor            = "move";  }

  getMouseX(e){
    let zoom_porcent:number = this.herramientas.zoom / 100;
    return (e.clientX - this.herramientas.ancho_trazo - 5 + this.lienzo.canvasCont.scrollLeft) / zoom_porcent;
  }

  getMouseY(e){
    let zoom_porcent:number = this.herramientas.zoom / 100;
    return (e.clientY - this.lienzo.canvasCont.offsetTop -this.herramientas.ancho_trazo/2 + this.lienzo.canvasCont.scrollTop) / zoom_porcent;
  }

  mouse_move(e){
    this.herramientas.mouseX = this.getMouseX(e);
    this.herramientas.mouseY = this.getMouseY(e);

    if (this.herramientas.mouse_down){
      let pos:any = {x:this.getMouseX(e), y: this.getMouseY(e) }; //se obtine la posicion del mouse con respecto al canvas
      this.lienzo.imagenActualizar = true;
      switch (this.herramientas.herramienta_seleccionada){
        case 'pincel':
          this.herramientas.mouse_ant.push( pos );
          this.lienzo.dibujar_ruta();
        break;

        case 'recorte':
          
        break;

        case 'mover':
          this.herramientas.mouse_ant.push( pos );
          this.desplazar_en_lienzo();
        break;
      } 

    }
    
  }

  desplazar_en_lienzo(){
    for (let c=1; c < this.herramientas.mouse_ant.length; c++){
      let diffX = this.herramientas.mouse_ant[c-1].x - this.herramientas.mouse_ant[c].x;
      let diffY = this.herramientas.mouse_ant[c-1].y - this.herramientas.mouse_ant[c].y;

      this.desplazar_lienzo(diffX, diffY);
    }
  }

  desplazar_lienzo(diffX, diffY){
    this.lienzo.canvasCont.scrollTop  += diffY;
    this.lienzo.canvasCont.scrollLeft += diffX;
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

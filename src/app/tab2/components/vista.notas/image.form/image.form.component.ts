import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Imagen } from 'src/app/models/imagen';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
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
    private privateNotaService:          PrivateNotaService,
    public  authService:                 AuthService,
  ) { 
    super(alertController, loadingController, ref, authService);    
  }

  private getAllSubj:any = [];
  public imagen:any;
  public model = new Imagen();
  public canvas_img:any;

  public herramientas:any = new HerramientaConfig();

  public areaEdicion:any;
  public context: any;
  public canvasCont:any;

  ngOnInit() {
    this.areaEdicion = document.getElementById('areaEdicion');
    this.canvasCont  = document.getElementById('canvasCont');
    this.context     = this.areaEdicion.getContext('2d');

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(this.privateImageService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagen = { file: p.base64, name:p.anydata.url, id:p.anydata.id, url:p.anydata.url, id_nota:p.anydata.id_nota };

        this.loadImageinCanvas();
      }}));
    }
  }

  loadImageinCanvas(){
    this.canvas_img = new Image();
        let me = this;
        this.canvas_img.onload = function() {
            let anchoCont = me.canvasCont.offsetWidth;
            let altoCont  = me.canvasCont.offsetHeight;
            let anchoimg = me.canvas_img.width;
            let altoimg  = me.canvas_img.height;
            let nAlto; let nAncho;

            if(anchoimg >= altoimg) {
                nAncho = anchoCont;
                nAlto = nAncho * altoimg / anchoimg;
            }
            else {
                nAlto  = altoCont;
                nAncho = anchoimg / altoimg * nAlto;
            }
            
            console.log(nAncho,',',nAlto);
            me.areaEdicion.style.width = Math.floor(nAncho)+'px';
            me.areaEdicion.style.height = Math.floor(nAlto)+'px';
            me.areaEdicion.width = Math.floor(nAncho);
            me.areaEdicion.height = Math.floor(nAlto);
            me.context.drawImage(me.canvas_img, 0, 0, Math.floor(nAncho), Math.floor(nAlto));
        };
        this.canvas_img.src = this.imagen.file;
  }

  goBack(){
    this.privateNotaService.goToEdit({ page:this, nota_id: this.imagen.id_nota });
    this.router.navigate([ this.privateImageService.navigationOrigin ]);
  }

  async ingresar(){
    this.model.base64_edit = this.areaEdicion.toDataURL("image/jpeg");
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
    console.log();
  }

  mouse_down(){
    this.herramientas.mouse_down = true;
    this.herramientas.mouse_ant = [];
  }

  mouse_up(){
    this.herramientas.mouse_down = false;
    if (this.herramientas.herramienta_seleccionada == 'pincel'){
      for (let c=1; c < this.herramientas.mouse_ant.length; c++){
        this.realizar_trazo( this.herramientas.mouse_ant[c-1].x, this.herramientas.mouse_ant[c-1].y, 
                              this.herramientas.mouse_ant[c].x, this.herramientas.mouse_ant[c].y, this.herramientas.ancho_trazo );
      }
    }
    this.herramientas.mouse_ant = [];
  }

  recorte(){
    this,this.herramientas.herramienta_seleccionada = 'recorte';
    this.herramientas.pincel_btn_color = 'medium';
    this.herramientas.recorte_btn_color = 'primary';
  }

  pincel(){
    this.herramientas.herramienta_seleccionada = 'pincel';
    this.herramientas.pincel_btn_color = 'primary';
    this.herramientas.recorte_btn_color = 'medium';
  }

  mouse_move(e){
    
    if (this.herramientas.mouse_down){

      if (this.herramientas.herramienta_seleccionada == 'pincel'){
        let radius = this.herramientas.ancho_trazo;
        //se obtine la posicion del mouse con respecto al canvas
        let pos:any = {x:e.clientX - radius - 5 + this.canvasCont.scrollLeft, y:e.clientY - this.canvasCont.offsetTop -radius/2 + this.canvasCont.scrollTop };
        this.herramientas.mouse_ant.push( pos );
        this.realizar_punto(pos.x, pos.y, radius);   
        for (let c=1; c < this.herramientas.mouse_ant.length; c++){
          this.realizar_trazo( this.herramientas.mouse_ant[c-1].x, this.herramientas.mouse_ant[c-1].y, 
                                this.herramientas.mouse_ant[c].x, this.herramientas.mouse_ant[c].y, this.herramientas.ancho_trazo );
        }     
      } else 
      if (this.herramientas.herramienta_seleccionada == 'recorte'){
  
      }

    }
    
  }

  realizar_trazo(x1, y1, x2, y2, radius){
    let limit = 500;
    x1 = Math.round(x1);
    x2 = Math.round(x2);
    y1 = Math.round(y1);
    y2 = Math.round(y2);
    while ( !(x1 == x2 && y1 == y2) && limit > 0 ){

      this.realizar_punto(x1,y1,radius);

      if (x1 < x2) { x1 ++; } else if(x1 != x2) { x1 --; }
      if (y1 < y2) { y1 ++; } else if(y1 != y2) { y1 --; }

      limit --;
    }
  }

  realizar_punto(x1, y1, radius){
      this.context.beginPath();
      this.context.moveTo(x1,y1);
      this.context.arc(x1,y1,radius,0,(Math.PI/180)*360,true);
      this.context.fillStyle = this.herramientas.color;
      this.context.fill();
  }

  reset(){
    this.loadImageinCanvas();
  }
}

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
  }

  mouse_up(){
    this.herramientas.mouse_down = false;
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
    let radius = this.herramientas.ancho_trazo;
    this.herramientas.mouseX = e.clientX - radius + this.canvasCont.scrollLeft;
    this.herramientas.mouseY = e.clientY - this.canvasCont.offsetTop +radius + this.canvasCont.scrollTop;
    if (this.herramientas.mouse_down && this.herramientas.herramienta_seleccionada == 'pincel'){
      this.context.beginPath();
      this.context.moveTo(this.herramientas.mouseX,this.herramientas.mouseY);
      this.context.arc(this.herramientas.mouseX,this.herramientas.mouseY,radius,0,(Math.PI/180)*360,true);
      this.context.fillStyle = this.herramientas.color;
      this.context.fill();
    }
  }

  reset(){
    this.loadImageinCanvas();
  }
}

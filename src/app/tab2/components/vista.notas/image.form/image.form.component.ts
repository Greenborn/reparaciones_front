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

  private imageDataEdit:any;
  private imageDataBuf:any;
  private imageDataBuf8:any;
  private imageData:any;
  private imagePixelCount:number;
  private imageWidth:number;

  private imagenCargada:boolean = false;
  private cargaImgBuffer:boolean = true;
  private imagenActualizar:boolean = false;
  private intevaloActualizacion:number = 1000/30;
  private intervalo:any = null;

  public herramientas:any = new HerramientaConfig();

  public areaEdicion:any;
  public context: any;
  public canvasCont:any;

  ngOnInit() {
    this.areaEdicion = document.getElementById('areaEdicion');
    this.canvasCont  = document.getElementById('canvasCont');
    this.context     = this.areaEdicion.getContext('2d');

    if (this.intervalo !== null){
      clearInterval(this.intervalo);
    }
    this.intervalo = setInterval( ()=>{ this.updateCanvas() }, this.intevaloActualizacion );

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(this.privateImageService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagen = { file: p.base64, name:p.anydata.url, id:p.anydata.id, url:p.anydata.url, id_nota:p.anydata.id_nota };

        this.loadImageinCanvas();
      }}));
    }
  }

  updateCanvas(){
    if (this.imagenCargada){
        if (this.cargaImgBuffer){
          this.cargaImgBuffer = false;
          //se pega la imagen original de fondo (deberia hacerse una sola vez luego de la carga de la imagen)
          for ( let c=0; c < this.imagePixelCount; c++ ){
            this.imageData[c]=(255 << 24)      | // alpha
                            (this.imageDataEdit.data[c*4 -2] << 16) | // blue
                            (this.imageDataEdit.data[c*4 -3] <<  8) | // green
                             this.imageDataEdit.data[c*4   ];
          }
        }
        this.imageDataEdit.data.set( this.imageDataBuf8 )
        this.context.putImageData( this.imageDataEdit, 0, 0);
        this.imagenActualizar = false;
    }
  }

  loadImageinCanvas(){
    this.imagenCargada = false;

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

            me.resize_canvas( me.context , me.herramientas.zoom);
            
            me.imageDataEdit   = me.context.getImageData(0, 0, anchoimg, altoimg);
            me.imageDataBuf    = new ArrayBuffer( me.imageDataEdit.data.length );
            me.imageDataBuf8   = new Uint8ClampedArray( me.imageDataBuf );
            me.imageData       = new Uint32Array( me.imageDataBuf );
            me.imagePixelCount = anchoimg * altoimg;
            me.imageWidth      = anchoimg;
            
            me.cargaImgBuffer  = true;

            me.imagenCargada = true;

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
  }

  mouse_down(){
    this.herramientas.mouse_down = true;
    this.herramientas.mouse_ant = [];
  }

  mouse_up(){
    this.herramientas.mouse_down = false;
    this.herramientas.mouse_ant = [];
  }

  private imageDataPreRecorte:any;
  recorte(){
    this,this.herramientas.herramienta_seleccionada = 'recorte';
    this.herramientas.pincel_btn_color  = 'medium';
    this.herramientas.recorte_btn_color = 'primary';
    this.herramientas.mover_btn_color   = 'medium';
    this.herramientas.cursor            = "crosshair";

    //se dibuja la selección
    this.imageDataPreRecorte = this.imageData;
    this.dibujar_seleccion(this.context, this.herramientas);
  }

  pincel(){
    this.herramientas.herramienta_seleccionada = 'pincel';
    this.herramientas.pincel_btn_color  = 'primary';
    this.herramientas.recorte_btn_color = 'medium';
    this.herramientas.mover_btn_color   = 'medium';
    this.herramientas.cursor            = "url('./assets/img/pencil.png'), default";
  }

  mover(){
    this.herramientas.herramienta_seleccionada = 'mover';
    this.herramientas.mover_btn_color   = 'primary';
    this.herramientas.recorte_btn_color = 'medium';
    this.herramientas.pincel_btn_color  = 'medium';
    this.herramientas.cursor            = "move";
    this.updateCanvas();
  }

  getMouseX(e){
    let zoom_porcent:number = this.herramientas.zoom / 100;
    return (e.clientX - this.herramientas.ancho_trazo - 5 + this.canvasCont.scrollLeft) / zoom_porcent;
  }

  getMouseY(e){
    let zoom_porcent:number = this.herramientas.zoom / 100;
    return (e.clientY - this.canvasCont.offsetTop -this.herramientas.ancho_trazo/2 + this.canvasCont.scrollTop) / zoom_porcent;
  }

  mouse_move(e){
    
    if (this.herramientas.mouse_down){
      let pos:any = {x:this.getMouseX(e), y: this.getMouseY(e) }; //se obtine la posicion del mouse con respecto al canvas
      this.imagenActualizar = true;
      switch (this.herramientas.herramienta_seleccionada){
        case 'pincel':
          this.herramientas.mouse_ant.push( pos );
          this.dibujar_ruta();
        break;

        case 'recorte':
          if (pos.x > this.herramientas.seleccion_recorte.x1 && pos.x < (this.herramientas.seleccion_recorte.x1 + this.herramientas.seleccion_recorte.scs)
              && pos.y > this.herramientas.seleccion_recorte.y1 && pos.y < (this.herramientas.seleccion_recorte.y1 + this.herramientas.seleccion_recorte.scs)) 
            {
              this.herramientas.seleccion_recorte.x1 = pos.x;
              this.herramientas.seleccion_recorte.y1 = pos.y;
              this.dibujar_seleccion(this.context, this.herramientas);
            }
        break;

        case 'mover':
          this.herramientas.mouse_ant.push( pos );
          this.desplazar_en_lienzo();
        break;
      } 

    }
    
  }

  dibujar_seleccion(contexto, herramienta_config){
    let ancho = contexto.canvas.width;
    let alto  = contexto.canvas.height;
    let hc = herramienta_config.seleccion_recorte;

    if (herramienta_config.seleccion_recorte.x1 == -1){
      hc.x1 = 1;
      hc.y1 = 1;
      hc.x2 = ancho;
      hc.y2 = alto;
    }

    //se dibujan los cuadrados del extremo de la selección
    this.dibuja_cuadrado_seleccion(contexto, hc.x1, hc.y1, hc.scs, hc.scs);
    this.dibuja_cuadrado_seleccion(contexto, hc.x2-hc.scs, hc.y2-hc.scs, hc.scs, hc.scs);
    this.dibuja_cuadrado_seleccion(contexto, hc.x1, hc.y2-hc.scs, hc.scs, hc.scs);
    this.dibuja_cuadrado_seleccion(contexto, hc.x2-hc.scs, hc.y1, hc.scs, hc.scs);
    
    //se dibujan las lineas que bordean la selección
    this.dibuja_cuadrado_seleccion(contexto, hc.scs, hc.ancho_trazo,       hc.ancho_trazo, ancho);
    this.dibuja_cuadrado_seleccion(contexto, hc.scs, alto-hc.ancho_trazo,  hc.ancho_trazo, ancho);
    this.dibuja_cuadrado_seleccion(contexto, hc.ancho_trazo, hc.scs,       alto, hc.ancho_trazo);
    this.dibuja_cuadrado_seleccion(contexto, ancho-hc.ancho_trazo, hc.scs, alto, hc.ancho_trazo);
    
    //Actualizar
    this.imagenActualizar = true;
  }

  dibuja_cuadrado_seleccion(contexto,x,y,alto, ancho){
    let vx = x + ancho;
    let vy = y + alto;
    for (let px = x; px <= vx; px++){
      for (let py = y; py <= vy; py ++){
        let pixel          = contexto.getImageData(px,py,1,1).data; 
        this.imageData[px + py] = (255            << 24)      | // alpha
                                  (255 - pixel[2] << 16) | // blue
                                  (255 - pixel[1] <<  8) | // green
                                   255 - pixel[0];   
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
    this.canvasCont.scrollTop  += diffY;
    this.canvasCont.scrollLeft += diffX;
  }

  dibujar_ruta(){
    for (let c=1; c < this.herramientas.mouse_ant.length; c++){
      this.realizar_trazo( this.herramientas.mouse_ant[c-1].x, this.herramientas.mouse_ant[c-1].y, 
                            this.herramientas.mouse_ant[c].x, this.herramientas.mouse_ant[c].y, this.herramientas.ancho_trazo );
    }
    this.imagenActualizar = true;
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
      let strColor:string = String(this.herramientas.color);
      this.imageData[(y1 * this.imageWidth) + x1] = (255 << 24)      | // alpha
                                  (parseInt(strColor[5]+strColor[6], 16) << 16) | // blue
                                  (parseInt(strColor[3]+strColor[4], 16) <<  8) | // green
                                   parseInt(strColor[1]+strColor[2], 16); 
  }

  cambiar_zoom(){
    if (this.herramientas.zoom < this.herramientas.min_zoom){
      this.herramientas.zoom = this.herramientas.min_zoom;
    } else if (this.herramientas.zoom > this.herramientas.max_zoom) {
      this.herramientas.zoom = this.herramientas.max_zoom;
    }
    
    this.resize_canvas( this.context , this.herramientas.zoom);
  }

  resize_canvas( canvas:any, zoom:number){
    //se obtiene el tamaño actual del elemento
    let ancho = canvas.canvas.width;
    let alto  = canvas.canvas.height;
    //se redimensiona el control canvas
    canvas.canvas.style.width  = ancho * (zoom / 100) + 'px';
    canvas.canvas.style.height = alto * (zoom / 100) + 'px';
  }
  
  cambiar_ancho_trazo(){
    if (this.herramientas.ancho_trazo < 1){
      this.herramientas.ancho_trazo = 1;
    } else if (this.herramientas.ancho_trazo > 10) {
      this.herramientas.ancho_trazo = 10;
    }
  }

  reset(){
    this.loadImageinCanvas();
  }
}

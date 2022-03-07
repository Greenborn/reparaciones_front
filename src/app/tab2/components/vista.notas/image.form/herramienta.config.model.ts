import { LienzoModel } from "./lienzo.model";

export class HerramientaConfig {
   public color:any = '#FF0000';

   public mouse_down:boolean = false;
   public mouseX:number = 0;
   public mouseY:number = 0;
   public mouse_ant:any = [];

   public herramienta_seleccionada:string = 'pincel';
   public pincel_btn_color:string = 'primary';
   public ancho_trazo:number = 5;
   public recorte_btn_color:string = 'medium';
   public mover_btn_color:string = 'medium';

   public zoom:number = 100;
   public min_zoom:number = 20;
   public max_zoom:number = 500;

   public cursor:string = "url('./assets/img/pencil.png'), default";

   public seleccion_recorte:any = { x1:-1, y1:-1, x2:-1, y2:-1, scs: 20, ancho_trazo: 2 };
   public lienzo:LienzoModel;

   recorte(){
      if (this.herramienta_seleccionada != 'recorte'){
         this.herramienta_seleccionada = 'recorte';
         this.pincel_btn_color  = 'medium';
         this.recorte_btn_color = 'primary';
         this.mover_btn_color   = 'medium';
         this.cursor            = "crosshair";
   
         //se dibuja la selección
         this.seleccion_recorte.x1 = 1;
         this.seleccion_recorte.y1 = 1;
         this.seleccion_recorte.x2 = this.lienzo.imageWidth;
         this.seleccion_recorte.y2 = this.lienzo.imageHeigth;
      
         this.lienzo.copiaImageData(this.lienzo.imageDataPreRecorte, this.lienzo.imageData);
         this.lienzo.dibujar_seleccion();
      }
   }
  
   pincel(){
      if (this.lienzo.imageDataPreRecorte.length != 0){
        this.lienzo.copiaImageData(this.lienzo.imageData, this.lienzo.imageDataPreRecorte);
        this.lienzo.imagenActualizar = true;
      }
  
      this.herramienta_seleccionada = 'pincel';
      this.pincel_btn_color  = 'primary';
      this.recorte_btn_color = 'medium';
      this.mover_btn_color   = 'medium';
      this.cursor            = "url('./assets/img/pencil.png'), default";
    }
  
    mover(){
      if (this.lienzo.imageDataPreRecorte.length != 0){
        this.lienzo.copiaImageData(this.lienzo.imageData, this.lienzo.imageDataPreRecorte);
        this.lienzo.imagenActualizar = true;
      }
  
      this.herramienta_seleccionada = 'mover';
      this.mover_btn_color   = 'primary';
      this.recorte_btn_color = 'medium';
      this.pincel_btn_color  = 'medium';
      this.cursor            = "move";  }
}
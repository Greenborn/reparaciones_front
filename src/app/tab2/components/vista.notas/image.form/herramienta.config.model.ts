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
   public page:any;

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

   async aplicarRecorte(){
      const alert = await this.page.alertController.create({
         header: 'Recorte',
         message: '¿Desea recortar la imagen?.',
         buttons: [{
           text: 'No',
           role: 'cancel',
           cssClass: 'secondary',
           handler: () => {}
         }, {
           text: 'Si',
           cssClass: 'danger',
           handler: () => {
             this.confirmarRecorte();
           }
         }]
       });
       await alert.present();
   }

   confirmarRecorte(){
      //se quita el cuadrado de seleccion
      this.lienzo.copiaImageData(this.lienzo.imageData, this.lienzo.imageDataPreRecorte);
      this.lienzo.imageDataEdit.data.set( this.lienzo.imageDataBuf8 )
      this.lienzo.context.putImageData( this.lienzo.imageDataEdit, 0, 0);

      //se obtiene la imagen actual del canvas
      let me = this;
      let img = new Image();
      img.src = this.lienzo.areaEdicion.toDataURL("image/jpeg");
      img.onload = function(){
         me.lienzo.imageWidth  = Math.abs(me.seleccion_recorte.x1-me.seleccion_recorte.x2);
         me.lienzo.imageHeigth = Math.abs(me.seleccion_recorte.y1-me.seleccion_recorte.y2);

         //se redimensiona el canvas al tamaño que deberia tener de acuerdo al recorte
         me.lienzo.areaEdicion.style.width = Math.floor(me.lienzo.imageWidth)+'px';
         me.lienzo.areaEdicion.style.height = Math.floor(me.lienzo.imageHeigth)+'px';
         me.lienzo.areaEdicion.width = Math.floor(me.lienzo.imageWidth);
         me.lienzo.areaEdicion.height = Math.floor(me.lienzo.imageHeigth);

         //se pega la imagen en el canvas
         me.lienzo.context.drawImage( img, 
            me.seleccion_recorte.x1, me.seleccion_recorte.y1, //coordenadas inicio recorte
            me.lienzo.imageWidth, me.lienzo.imageHeigth, //ancho de la zona a recortar
            0,0, // posicion en donde pegar la imagen en el canvas
            me.lienzo.imageWidth, me.lienzo.imageHeigth // ancho y alto del recorte
         );

         //Se actualiza el contenido de la informacion de imagen pre-recorte
         //para que al salir de la herramienta de recorte no se resetee la imagen
         me.lienzo.imageDataEdit   = me.lienzo.context.getImageData(0, 0, me.lienzo.imageWidth, me.lienzo.imageHeigth);
         me.lienzo.imageDataBuf    = new ArrayBuffer( me.lienzo.imageDataEdit.data.length );
         me.lienzo.imageDataBuf8   = new Uint8ClampedArray( me.lienzo.imageDataBuf );
         me.lienzo.imageData       = new Uint32Array( me.lienzo.imageDataBuf ); 

         me.lienzo.imagePixelCount = me.lienzo.imageWidth * me.lienzo.imageHeigth;

         me.lienzo.pegarImagenFondo();
         me.lienzo.imagenCargada = true;
         me.lienzo.copiaImageData(me.lienzo.imageDataPreRecorte, me.lienzo.imageData);
      }
      console.log(img);
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

   constructor(params){
      this.page = params.page;
   }
}
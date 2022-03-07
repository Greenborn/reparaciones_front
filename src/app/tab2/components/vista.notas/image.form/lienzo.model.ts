import { HerramientaConfig } from "./herramienta.config.model";

export class LienzoModel {
    public mouseX:number = 0;
    public mouseY:number = 0;
    
    public areaEdicion;
    public canvasCont;
    public context;

    public intervaloActualizacion;
    public intevaloActualizacionMs:number;

    public herramientas:HerramientaConfig;

    private imageDataEdit:any;
    private imageDataBuf:any;
    private imageDataBuf8:any;
    public imageData:any;
    private imagePixelCount:number;
    public imageWidth:number;
    public imageHeigth:number;

    public imagenCargada:boolean = false;
    public cargaImgBuffer:boolean = true;
    public imagenActualizar:boolean = false;

    constructor(params){
        this.areaEdicion = document.getElementById(params.areaEdicion);
        this.canvasCont  = document.getElementById(params.canvasCont);
        this.context     = this.areaEdicion.getContext('2d');

        this.herramientas = params.herramientas;
        this.intevaloActualizacionMs = 1000 / params.fps;

        this.intervaloActualizacion = setInterval( ()=>{ this.updateCanvas() }, this.intevaloActualizacionMs );
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
    
            if (this.herramientas.herramienta_seleccionada == 'recorte'){
              this.dibujar_seleccion();
            }
            this.imageDataEdit.data.set( this.imageDataBuf8 )
            this.context.putImageData( this.imageDataEdit, 0, 0);
            this.imagenActualizar = false;
        }
    }

    loadImage( imagen ){
        let img = new Image();
        let me  = this;

        img.onload = function() {
            let anchoCont = me.canvasCont.offsetWidth;
            let altoCont  = me.canvasCont.offsetHeight;
            let anchoimg = img.width;
            let altoimg  = img.height;
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
            me.context.drawImage(img, 0, 0, Math.floor(nAncho), Math.floor(nAlto));

            me.resize_canvas( me.context , me.herramientas.zoom);
            
            me.imageDataEdit   = me.context.getImageData(0, 0, anchoimg, altoimg);
            me.imageDataBuf    = new ArrayBuffer( me.imageDataEdit.data.length );
            me.imageDataBuf8   = new Uint8ClampedArray( me.imageDataBuf );
            me.imageData       = new Uint32Array( me.imageDataBuf );
            me.imagePixelCount = anchoimg * altoimg;
            me.imageWidth      = anchoimg;
            me.imageHeigth     = altoimg;
            
            me.cargaImgBuffer  = true;

            me.imagenCargada = true;
        }

        img.src = imagen.file;
    }

    resize_canvas( canvas:any, zoom:number){
        //se obtiene el tamaño actual del elemento
        let ancho = canvas.canvas.width;
        let alto  = canvas.canvas.height;
        //se redimensiona el control canvas
        canvas.canvas.style.width  = ancho * (zoom / 100) + 'px';
        canvas.canvas.style.height = alto * (zoom / 100) + 'px';
    }

    cambiar_zoom(){
        if (this.herramientas.zoom < this.herramientas.min_zoom){
          this.herramientas.zoom = this.herramientas.min_zoom;
        } else if (this.herramientas.zoom > this.herramientas.max_zoom) {
          this.herramientas.zoom = this.herramientas.max_zoom;
        }
        
        this.resize_canvas( this.context , this.herramientas.zoom);
    }

    public imageDataPreRecorte:any = [];

    copiaImageData(ar1, ar2){
        for (let c=0; c<this.imagePixelCount; c++){
          ar1[c] = ar2[c];
        }
      }


      dibujar_seleccion(){
        this.copiaImageData(this.imageData, this.imageDataPreRecorte);
        
    
        //se dibujan los cuadrados del extremo de la selección
        this.dibuja_cuadrado_seleccion(this.imageData, this.herramientas.mouseX, this.herramientas.mouseY, 10, 10);
        
        /*this.dibuja_cuadrado_seleccion(imgData, hc.x2-hc.scs, hc.y2-hc.scs, hc.scs, hc.scs);
        this.dibuja_cuadrado_seleccion(imgData, hc.x1, hc.y2-hc.scs, hc.scs, hc.scs);
        this.dibuja_cuadrado_seleccion(imgData, hc.x2-hc.scs, hc.y1, hc.scs, hc.scs);
        
        //se dibujan las lineas que bordean la selección
        this.dibuja_cuadrado_seleccion(imgData, hc.scs, hc.ancho_trazo,       hc.ancho_trazo, ancho);
        this.dibuja_cuadrado_seleccion(imgData, hc.scs, alto-hc.ancho_trazo,  hc.ancho_trazo, ancho);
        this.dibuja_cuadrado_seleccion(imgData, hc.ancho_trazo, hc.scs,       alto, hc.ancho_trazo);
        this.dibuja_cuadrado_seleccion(imgData, ancho-hc.ancho_trazo, hc.scs, alto, hc.ancho_trazo);
        */
        //Actualizar
        this.imagenActualizar = true;
      }

      dibuja_cuadrado_seleccion(imgData, x, y, alto, ancho){
        let vx = x + ancho;
        let vy = y + alto;
    
        for (let px = x; px <= vx; px++){
          for (let py = y; py <= vy; py ++){
            let pixel:any = { 
                            'r': imgData[((py * this.imageWidth) + px)*4],
                            'g': imgData[((py * this.imageWidth) + px)*4 -3],
                            'b': imgData[((py * this.imageWidth) + px)*4 -2]
                        };
    
            
          }
        }
        this.realizar_punto(x,y,10,{r:255,g:0,b:0});
      }

      realizar_punto(x1, y1, radius, color){
        for ( let cx=0; cx <= radius; cx++){
          for ( let cy=0; cy <= radius; cy++){
              let px = x1 + cx;
              let py = y1 + cy;
  
              if ( !(px < 0 || py < 0 || px > this.imageWidth || py > this.imageHeigth) ){
                this.imageData[(py * this.imageWidth) + px] = (255 << 24)      | // alpha
                                    (color.b << 16) | // blue
                                    (color.g <<  8) | // green
                                     color.r;
              }
  
          }
        }     
    }

    realizar_trazo(x1, y1, x2, y2, radius){
        let limit = 500;
        x1 = Math.round(x1);
        x2 = Math.round(x2);
        y1 = Math.round(y1);
        y2 = Math.round(y2);
    
        let strColor:string = String(this.herramientas.color);
        let color = { 
          r: parseInt(strColor[1]+strColor[2], 16), 
          g: parseInt(strColor[3]+strColor[4], 16),
          b: parseInt(strColor[5]+strColor[6], 16)
        };
    
        while ( !(x1 == x2 && y1 == y2) && limit > 0 ){
    
          this.realizar_punto(x1,y1,radius, color);
    
          if (x1 < x2) { x1 ++; } else if(x1 != x2) { x1 --; }
          if (y1 < y2) { y1 ++; } else if(y1 != y2) { y1 --; }
    
          limit --;
        }
      }

    dibujar_ruta(){
        for (let c=1; c < this.herramientas.mouse_ant.length; c++){
          this.realizar_trazo( this.herramientas.mouse_ant[c-1].x, this.herramientas.mouse_ant[c-1].y, 
                                this.herramientas.mouse_ant[c].x, this.herramientas.mouse_ant[c].y, this.herramientas.ancho_trazo );
        }
        this.imagenActualizar = true;
      }
}
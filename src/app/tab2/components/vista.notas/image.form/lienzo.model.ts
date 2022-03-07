import { HerramientaConfig } from "./herramienta.config.model";

const COLA_PIXEL_LIMIT = 100000;

export class LienzoModel {
    public mouseX:number = 0;
    public mouseY:number = 0;
    
    public areaEdicion;
    public canvasCont;
    public context;

    public intervaloActualizacion;
    public intevaloActualizacionMs:number;

    public herramientas:HerramientaConfig;

    public imageDataEdit:any;
    public imageDataBuf:any;
    public imageDataBuf8:any;
    public imageData:any;
    public imagePixelCount:number;
    public imageWidth:number;
    public imageHeigth:number;

    public imagenCargada:boolean = false;
    public imagenActualizar:boolean = false;

    constructor(params){
        this.areaEdicion = document.getElementById(params.areaEdicion);
        this.canvasCont  = document.getElementById(params.canvasCont);
        this.context     = this.areaEdicion.getContext('2d');

        this.herramientas = params.herramientas;
        this.intevaloActualizacionMs = 1000 / params.fps;

        this.intervaloActualizacion = setInterval( ()=>{ this.updateCanvas() }, this.intevaloActualizacionMs );
    }

    //Se usan estos arreglos y así separados por cuestiones de rendimiento
    //ya que se van a hacer millones de iteraciones
    // igual habria que ver como el llamado a funciones afecta en el rendimiento
    // pero por ahora el tiempo es acotado, cosa para ver mas tarde
    public colaPixelesR:any = new Uint8Array(COLA_PIXEL_LIMIT);
    public colaPixelesG:any = new Uint8Array(COLA_PIXEL_LIMIT);
    public colaPixelesB:any = new Uint8Array(COLA_PIXEL_LIMIT);
    public colaPixelesX:any = new Uint32Array(COLA_PIXEL_LIMIT);
    public colaPixelesY:any = new Uint32Array(COLA_PIXEL_LIMIT);
    public colaPixelesP:any = new Uint32Array(COLA_PIXEL_LIMIT);

    updateCanvas(){
        //si la imagen no esta cargada, salimos
        if (!this.imagenCargada){
            return false;
        }

        //si no hay que hacer actualizacion salimos
        if (!this.imagenActualizar){
            return false;
        }
        this.imagenActualizar = false;

        //si se tiene seleccionado el lapiz, se completa el trazo agregando los pixeles a la cola
        if (this.herramientas.herramienta_seleccionada == 'pincel'){
            let mposL = this.herramientas.mouse_ant.length;
            if (mposL > 1){
                for (let c=1; c < mposL; c++){
                    let x1 = Math.round(this.herramientas.mouse_ant[c-1].x);
                    let y1 = Math.round(this.herramientas.mouse_ant[c-1].y);
                            
                    let x2 = Math.round(this.herramientas.mouse_ant[c].x);
                    let y2 = Math.round(this.herramientas.mouse_ant[c].y);
    
                    let seguro = 1000;
                    while ( !(x1 == x2 && y1 == y2) && seguro > 0 ){
                        if (x1 < x2) { x1 ++; } else if (x1 > x2 ) { x1 --; }
                        if (y1 < y2) { y1 ++; } else if (y1 > y2 ) { y1 --; }
                                
                        this.trazo_lapiz(x1,y1);
                        seguro --;
                    }
                }
                let aux = this.herramientas.mouse_ant[mposL-1];
                this.herramientas.mouse_ant = [];
                this.herramientas.mouse_ant.push(aux);
            }
            
        }

        //se recorre la cola de pixeles
        for (let c = 0; c < COLA_PIXEL_LIMIT; c++){
            if (this.colaPixelesX[c] < 0 || this.colaPixelesY[c] < 0 || 
                this.colaPixelesX[c] > this.imageWidth || this.colaPixelesY[c] > this.imageHeigth){
                continue;
            }

            if (this.colaPixelesP[c] == 0){ // no hay pixel que dibujar
                break;
            }
            
            if (this.colaPixelesP[c] == 1){ //color normal
                this.imageData[(this.colaPixelesY[c] * this.imageWidth) + this.colaPixelesX[c]] = (255 << 24)      | // alpha
                                        (this.colaPixelesB[c] << 16) | // blue
                                        (this.colaPixelesG[c] <<  8) | // green
                                        this.colaPixelesR[c];
            } else if (this.colaPixelesP[c] == 2) { // invertir color
                let color = this.toColor(this.imageDataPreRecorte[(this.colaPixelesY[c] * this.imageWidth) + this.colaPixelesX[c]]);
                this.imageData[(this.colaPixelesY[c] * this.imageWidth) + this.colaPixelesX[c]] = (255 << 24)      | // alpha
                                        (255 - color[0] << 16) | // blue
                                        (255 - color[1] <<  8) | // green
                                         255 - color[2];
            }
        }

        //se vacia la cola de pixeles
        this.colaPixelesR = new Uint8Array(COLA_PIXEL_LIMIT);
        this.colaPixelesG = new Uint8Array(COLA_PIXEL_LIMIT);
        this.colaPixelesB = new Uint8Array(COLA_PIXEL_LIMIT);
        this.colaPixelesX = new Uint32Array(COLA_PIXEL_LIMIT);
        this.colaPixelesY = new Uint32Array(COLA_PIXEL_LIMIT); 
        this.colaPixelesP = new Uint32Array(COLA_PIXEL_LIMIT); 
        this.ci = 0;
        
        //se pega la imagen en el canvas
        this.imageDataEdit.data.set( this.imageDataBuf8 )
        this.context.putImageData( this.imageDataEdit, 0, 0);
    }

    pegarImagenFondo(){
        //se pega la imagen original de fondo (deberia hacerse una sola vez luego de la carga de la imagen)
        for ( let c=0; c < this.imagePixelCount; c++ ){
              this.imageData[c]=(255 << 24)      | // alpha
                              (this.imageDataEdit.data[c*4 -2] << 16) | // blue
                              (this.imageDataEdit.data[c*4 -3] <<  8) | // green
                               this.imageDataEdit.data[c*4   ];
        }
    }

    loadImage( imagen ){
        let img = new Image();
        let me  = this;

        img.onload = function() {
            me.imageWidth  = img.width;
            me.imageHeigth = img.height;

            me.areaEdicion.style.width = Math.floor(me.imageWidth)+'px';
            me.areaEdicion.style.height = Math.floor(me.imageHeigth)+'px';
            me.areaEdicion.width = Math.floor(me.imageWidth);
            me.areaEdicion.height = Math.floor(me.imageHeigth);
            me.context.drawImage(img, 0, 0, Math.floor(me.imageWidth), Math.floor(me.imageHeigth));

            me.resize_canvas( me.context , me.herramientas.zoom);
            
            me.imageDataEdit   = me.context.getImageData(0, 0, me.imageWidth, me.imageHeigth);
            me.imageDataBuf    = new ArrayBuffer( me.imageDataEdit.data.length );
            me.imageDataBuf8   = new Uint8ClampedArray( me.imageDataBuf );
            me.imageData       = new Uint32Array( me.imageDataBuf );
            me.imagePixelCount = me.imageWidth * me.imageHeigth;

            me.pegarImagenFondo();
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
        let hc    = this.herramientas.seleccion_recorte;

        let imgData = this.imageDataEdit.data;
        //se dibujan los cuadrados del extremo de la selección
        this.dibuja_cuadrado_seleccion(imgData, hc.x1,        hc.y1,        hc.scs, hc.scs);
        this.dibuja_cuadrado_seleccion(imgData, hc.x2-hc.scs, hc.y2-hc.scs, hc.scs, hc.scs);
        this.dibuja_cuadrado_seleccion(imgData, hc.x1, hc.y2-hc.scs, hc.scs, hc.scs);
        this.dibuja_cuadrado_seleccion(imgData, hc.x2-hc.scs, hc.y1, hc.scs, hc.scs);
        
        //se dibujan las lineas que bordean la selecciónhc.ancho_trazo
        this.dibuja_cuadrado_seleccion(this.imageData, hc.x1, hc.y1,                  hc.ancho_trazo, Math.abs(hc.x1-hc.x2));
        this.dibuja_cuadrado_seleccion(this.imageData, hc.x1, hc.y2 - hc.ancho_trazo, hc.ancho_trazo, Math.abs(hc.x1-hc.x2));

        this.dibuja_cuadrado_seleccion(this.imageData, hc.x1,                  hc.y1, Math.abs(hc.y1-hc.y2), hc.ancho_trazo);
        this.dibuja_cuadrado_seleccion(this.imageData, hc.x2 - hc.ancho_trazo, hc.y1, Math.abs(hc.y1-hc.y2), hc.ancho_trazo);

        //Actualizar
        this.imagenActualizar = true;
      }

      dibuja_cuadrado_seleccion(imgData, x, y, alto, ancho){
        let vx = x + ancho;
        let vy = y + alto;

        for (let px = x; px <= vx; px++){
          for (let py = y; py <= vy; py ++){
            this.realizarPixel(px,py, -1, -1, -1);
          }
        }
        
      }

    toColor(num) {
        num >>>= 0;
        var b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
        return [r, g, b, a];
    }

    private ci:number = 0;
    realizar_punto(x1, y1, radius, R, G, B){
        for ( let cx=0; cx <= radius; cx++){
          for ( let cy=0; cy <= radius; cy++){
            let px = x1 + cx;
            let py = y1 + cy;
  
            this.realizarPixel(px, py, R, G, B);
          }
        }     
    }

    realizarPixel(px, py, R, G, B){
        if (this.ci<COLA_PIXEL_LIMIT){
            this.colaPixelesR[this.ci] = R;
            this.colaPixelesG[this.ci] = G;
            this.colaPixelesB[this.ci] = B;
            this.colaPixelesX[this.ci] = px;
            this.colaPixelesY[this.ci] = py; 

            if (R == -1 && G == -1 && B == -1){
                this.colaPixelesP[this.ci] = 2;     //si es 2 se invierte el color
            } else 
                this.colaPixelesP[this.ci] = 1;     //color normal
            this.ci++; 
        }
    }

    trazo_lapiz(x1:number, y1:number){
        let radius          = this.herramientas.ancho_trazo;
        let strColor:string = String(this.herramientas.color);
        let R:number        = parseInt(strColor[1]+strColor[2], 16); 
        let G:number        = parseInt(strColor[3]+strColor[4], 16);
        let B:number        = parseInt(strColor[5]+strColor[6], 16);
        
        this.realizar_punto(x1, y1, radius, R, G, B);  
    }

    mouse_down(e){
        this.herramientas.mouse_down = true;
    }
    
    mouse_up(){
        this.herramientas.mouse_down = false;
        this.herramientas.mouse_ant = [];
    }

    mouse_move(e){
        this.herramientas.mouseX = this.getMouseX(e);
        this.herramientas.mouseY = this.getMouseY(e);
    
        if (this.herramientas.mouse_down){
          let pos:any = {x:this.herramientas.mouseX, y: this.herramientas.mouseY }; //se obtine la posicion del mouse con respecto al canvas
          this.imagenActualizar = true;
          switch (this.herramientas.herramienta_seleccionada){
            case 'pincel':
              this.herramientas.mouse_ant.push( pos );
              //this.lienzo.trazo_lapiz(pos.x, pos.y);
            break;
    
            case 'recorte':
                let dist_m:number = 4;
                //Se comprueba si el mouse esta en el punto superior izquierdo de la seleccion
                if ( Math.abs(this.herramientas.mouseX - this.herramientas.seleccion_recorte.x1) <= this.herramientas.seleccion_recorte.scs * dist_m
                    && Math.abs(this.herramientas.mouseY - this.herramientas.seleccion_recorte.y1) <= this.herramientas.seleccion_recorte.scs * dist_m){
                        this.herramientas.seleccion_recorte.x1 = this.herramientas.mouseX;
                        this.herramientas.seleccion_recorte.y1 = this.herramientas.mouseY;
                    }

                //Se comprueba si el mouse está en la esquina superior derecha
                if ( Math.abs(this.herramientas.mouseX - this.herramientas.seleccion_recorte.x2) <= this.herramientas.seleccion_recorte.scs * dist_m
                    && Math.abs(this.herramientas.mouseY - this.herramientas.seleccion_recorte.y1) <= this.herramientas.seleccion_recorte.scs * dist_m){
                        this.herramientas.seleccion_recorte.x2 = this.herramientas.mouseX;
                        this.herramientas.seleccion_recorte.y1 = this.herramientas.mouseY;
                    }

                //Se comprueba si el mouse está en la esquina inferior izquierda
                if ( Math.abs(this.herramientas.mouseX - this.herramientas.seleccion_recorte.x1) <= this.herramientas.seleccion_recorte.scs * dist_m
                    && Math.abs(this.herramientas.mouseY - this.herramientas.seleccion_recorte.y2) <= this.herramientas.seleccion_recorte.scs * dist_m){
                        this.herramientas.seleccion_recorte.x1 = this.herramientas.mouseX;
                        this.herramientas.seleccion_recorte.y2 = this.herramientas.mouseY;
                    }

                //Se comprueba si el mouse está en la esquina inferior derecha
                if ( Math.abs(this.herramientas.mouseX - this.herramientas.seleccion_recorte.x2) <= this.herramientas.seleccion_recorte.scs * dist_m
                    && Math.abs(this.herramientas.mouseY - this.herramientas.seleccion_recorte.y2) <= this.herramientas.seleccion_recorte.scs * dist_m){
                        this.herramientas.seleccion_recorte.x2 = this.herramientas.mouseX;
                        this.herramientas.seleccion_recorte.y2 = this.herramientas.mouseY;
                    }
                this.dibujar_seleccion();
            break;
    
            case 'mover':
              this.herramientas.mouse_ant.push( pos );
              this.desplazar_en_lienzo();
            break;
          } 
    
        }
        
    }

    getMouseX(e){
        let zoom_porcent:number = this.herramientas.zoom / 100;
        return (e.clientX - this.herramientas.ancho_trazo - 5 + this.canvasCont.scrollLeft) / zoom_porcent;
    }
    
    getMouseY(e){
        let zoom_porcent:number = this.herramientas.zoom / 100;
        return (e.clientY - this.canvasCont.offsetTop -this.herramientas.ancho_trazo/2 + this.canvasCont.scrollTop) / zoom_porcent;
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
}
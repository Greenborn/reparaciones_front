import { HerramientaConfig } from "./herramienta.config.model";

const COLA_PIXEL_LIMIT = 5000;

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
    public imagenActualizar:boolean = false;

    constructor(params){
        this.areaEdicion = document.getElementById(params.areaEdicion);
        this.canvasCont  = document.getElementById(params.canvasCont);
        this.context     = this.areaEdicion.getContext('2d');

        this.herramientas = params.herramientas;
        this.intevaloActualizacionMs = 1000 / params.fps;

        this.intervaloActualizacion = setInterval( ()=>{ this.updateCanvas() }, this.intevaloActualizacionMs );
    }

    public mousePosCnt:number = 1;

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

            if (this.colaPixelesP[c] == 0){
                break;
            }
            
            this.imageData[(this.colaPixelesY[c] * this.imageWidth) + this.colaPixelesX[c]] = (255 << 24)      | // alpha
                                    (this.colaPixelesB[c] << 16) | // blue
                                    (this.colaPixelesG[c] <<  8) | // green
                                     this.colaPixelesR[c];
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
        this.realizar_punto(x,y,10, 255, 0, 0);
      }

    private ci:number = 0;
    realizar_punto(x1, y1, radius, R, G, B){
        for ( let cx=0; cx <= radius; cx++){
          for ( let cy=0; cy <= radius; cy++){
            let px = x1 + cx;
            let py = y1 + cy;

            if (this.ci>COLA_PIXEL_LIMIT){
                break;
            }
  
            this.colaPixelesR[this.ci] = R;
            this.colaPixelesG[this.ci] = G;
            this.colaPixelesB[this.ci] = B;
            this.colaPixelesX[this.ci] = px;
            this.colaPixelesY[this.ci] = py; 
            this.colaPixelesP[this.ci] = 1; 
            this.ci++;  
          }
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

}
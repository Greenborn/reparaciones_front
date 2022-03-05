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

   public seleccion_recorte:any = { x1:-1, y1:-1, x2:-1, y2:-1, scs: 10, ancho_trazo: 2 };
}
import { AppUIUtilsService } from "src/app/services/app.ui.utils.service";
import { PrivateEstadoService } from "src/app/services/private.estado.service";
import { PrivateNotaService } from "src/app/services/private.nota.service";

export class FiltroNotas {

    public filtros_visibles:boolean = false;
    public filtros_text:string      = 'Ver filtros';
    public obra_id:any              = -1;
    public tipo_nota_id:any         = -1;
    public categoria_id:any         = -1;
    public estado_id:any            = -1;
    public filtro_vencidas:string   = 'todas';

    private privateNotaService:   PrivateNotaService;
    private privateEstadoService: PrivateEstadoService;
    private appUIUtilsService:    AppUIUtilsService;
    setNotaService( servicio: PrivateNotaService ) {   this.privateNotaService  = servicio; }
    setEstadoService( servicio: PrivateEstadoService ) {   this.privateEstadoService  = servicio; }
    setAppUIUtilsService( servicio: AppUIUtilsService ) {   this.appUIUtilsService  = servicio; }

    toggle_filtros(){
        this.filtros_visibles = !this.filtros_visibles;
        if ( this.filtros_visibles ){
            this.filtros_text = 'Ocultar filtros';
        } else {
            this.filtros_text = 'Ver filtros';
        }
    }

    //OBRAS
    clear_obra(){
        this.obra_id = -1;
        this.actualizar_filtros();
    }

    obra_seleccionada(){
        this.actualizar_filtros();
    }

    //VENCIDAS
    set_vencidas( filtro:string ){
        this.filtro_vencidas = filtro;
        this.actualizar_filtros();
    }

    //TIPO NOTAS
    tipo_nota_seleccionada(){
        this.actualizar_filtros();
    }

    clear_tipo_nota(){
        this.tipo_nota_id = -1;
        this.actualizar_filtros();
    }

    //CATEGORIAS
    categoria_seleccionada(){
        this.cargar_estados( this.categoria_id );
        this.actualizar_filtros();
    }

    clear_categoria(){
        this.categoria_id = -1;
        this.estado_id    = -1;
        this.actualizar_filtros();
    }

    //ESTADOS
    cargar_estados(id){
        this.appUIUtilsService.presentLoading({ message: 'Consultando listado de estados...' });

        this.privateEstadoService.getAll({
            getParams: 'filter[categoria_id]='+id,
            callback: ()=>{ 
                this.appUIUtilsService.dissmisLoading();
            }
        });
    }

    estado_seleccionado(){
        this.actualizar_filtros();
    }

    clear_estado(){
        this.estado_id = -1;
    }

    //ACTUALIZAR FILTROS
    actualizar_filtros(){
        let params:string = 'expand=categoria,obra,tipoNota';
        
        if ( this.obra_id != undefined && this.obra_id != -1 ){
            params += '&filter[obra_id]='+this.obra_id;
        }

        if ( this.tipo_nota_id != undefined && this.tipo_nota_id != -1 ){
            params += '&filter[tipo_nota_id]='+this.tipo_nota_id;
        } 

        if ( this.categoria_id != undefined && this.categoria_id != -1 ){
            params += '&filter[categoria_id]='+this.categoria_id;
        } 

        if ( this.estado_id != undefined && this.estado_id != -1 ){
            params += '&filter[estado_id]='+this.estado_id;
        } 

        if (this.filtro_vencidas == 'vencidas') {
            let date:any  = new Date();
            date          = date.toISOString();
            params       += '&filter[vencimiento]=<' + date;
        }

        this.privateNotaService.getNotas({
            getParams:    params
        });
    }

    clear_all(){
        this.clear_categoria();
        this.clear_estado();
        this.clear_obra();
        this.clear_tipo_nota();
    }
}
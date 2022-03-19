import { PrivateNotaService } from "src/app/services/private.nota.service";
import { PrivateObrasService } from "src/app/services/private.obras.service";

export class FiltroNotas {

    public filtros_visibles:boolean = false;
    public filtros_text:string      = 'Ver filtros';
    public obra_id:any              = -1;
    public tipo_nota_id:any         = -1;
    public filtro_vencidas:string   = 'todas';

    private privateObrasService: PrivateObrasService;
    private privateNotaService:  PrivateNotaService;
    setNotaService( servicio: PrivateNotaService ) {   this.privateNotaService  = servicio; }
    setObrasService( servicio: PrivateObrasService ){  this.privateObrasService = servicio; }

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

    //ACTUALIZAR FILTROS
    actualizar_filtros(){
        let params:string = 'expand=categoria,obra,tipoNota';
        
        if ( this.obra_id != undefined && this.obra_id != -1 ){
            params += '&filter[obra_id]='+this.obra_id;
        }

        if ( this.tipo_nota_id != undefined && this.tipo_nota_id != -1 ){
            params += '&filter[tipo_nota_id]='+this.tipo_nota_id;
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
}
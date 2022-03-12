export class Nota {
    public id:number;
    public nota:string = '';
    public categoria_id:any = -1;
    public estado_id:any = -1;
    public obra_id:any = -1;
    public vencimiento:any;
    public vencimiento_hora:any;
    public orden:number = 0;
    public tipo_nota_id:any = -1;

    public images:any = [];
    public documentos:any = [];
    public imagenes:any = [];

    datosValidos(){
        if ( this.nota == ''){
            return { msg:"Es necesario completar el texto correspondiente a la nota.", success: false };
        }

        if ( this.categoria_id == -1){
            return { msg:"Es necesario definir una categoría.", success: false };  
        }

        if ( this.estado_id == -1){
            return { msg:"Es necesario definir un estado.", success: false };  
        }

        if ( this.obra_id == -1){
            return { msg:"Es necesario definir una obra.", success: false };
        }

        if ( this.vencimiento == undefined){
            return { msg:"Es necesario definir una fecha de vencimiento.", success: false };
        }

        return { msg:"", success: true };
    }

    preparar_envio( formateoService, privateNotaService ){
        this.vencimiento = formateoService.getDateNgbDatepickerArray( this.vencimiento );
        this.vencimiento.setSeconds( this.vencimiento_hora.second );
        this.vencimiento.setHours( this.vencimiento_hora.hour );
        this.vencimiento.setMinutes( this.vencimiento_hora.minute );
        this.vencimiento = formateoService.getFechaISOASP( this.vencimiento );

        this.images     = privateNotaService.nota_images;
        this.documentos = privateNotaService.nota_documentos;
    }

    constructor( params:any = {}){
        if ( params.hasOwnProperty('id_obra') ){
            this.obra_id = params.obra_id;
        }
    }
}
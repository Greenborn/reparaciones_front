export class Categoria {
    public id:number     = -1;
    public nombre:string = '';
    public color:string  = '#FFFFFF';

    public estados:any   = [];

    datosValidos(){
        if ( this.color == ''){
            return { msg:"Debe definir un color para la categoría.", success: false };
        }

        if ( this.nombre == ''){
            return { msg:"Debe definir un nombre para la categoría.", success: false };
        }

        return { msg:"", success: true };
    }

    constructor( params:any = {}){
        //DEFINIMOS LAS PROPIEDADES DEL MODELO, SI ES QUE EXITEN EN EL MISMO
        let claves = Object.keys(params);
        for(let i=0; i< claves.length; i++){
            if ( this.hasOwnProperty(claves[i]) ){
                this[claves[i]] = params[claves[i]];
            }
        }
    }
}
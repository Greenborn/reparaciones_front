export class Estado {
    public id:number           = -1;
    public nombre:string       = '';
    public categoria_id:number = -1;

    datosValidos(){
        if ( this.nombre == ''){
            return { msg:"Debe definir un nombre.", success: false };
        }

        if ( this.categoria_id == -1){
            return { msg:"Debe crear el estado a partir del formulario de creación o edición de categoría.", success: false };
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
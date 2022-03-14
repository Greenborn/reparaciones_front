export class TipoNota {
    public id:number;
    public nombre:string;
    public color:string = '#FFFFFF';

    datosValidos(){
        if ( this.color == ''){
            return { msg:"Debe definir un color para el tipo de nota.", success: false };
        }

        if ( this.nombre == ''){
            return { msg:"Debe definir un nombre para tipo de nota.", success: false };
        }

        return { msg:"", success: true };
    }
}
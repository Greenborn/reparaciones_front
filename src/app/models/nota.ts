export class Nota {
    public id:number;
    public nota:string;
    public categoria_id:any = -1;
    public estado_id:any = -1;
    public obra_id:any = -1;
    public vencimiento:any;
    public vencimiento_hora:any;
    public orden:number = 0;
    public tipo_nota_id:any = -1;

    public images:any = [];
    public documents:any = [];
    public imagenes:any = [];
}
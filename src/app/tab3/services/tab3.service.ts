import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class Tab3Service {

  constructor() { }

  public recargarCategoria:Subject<any> = new Subject();
  public categoria_edit_id:number = 0;

  public estado_edit_id:number = 0;
  public recargarEstado:Subject<any> = new Subject();
  public estado_categoria_id:number;

  public tipo_nota_edit_id:number = 0;
  public recargarTipoNota:Subject<any> = new Subject();
}
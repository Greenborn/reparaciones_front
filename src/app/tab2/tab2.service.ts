import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class Tab2Service {

  constructor() { }

  public recargarNotas:Subject<any> = new Subject();
  public nueva_nota_obra_id:number;
  public nota_edit_id:number = 0;

  public recargarObras:Subject<any> = new Subject();
  public navigationOrigin:string = '/tabs/tab1';
}
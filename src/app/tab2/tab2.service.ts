import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class Tab2Service {

  constructor() { }

  public recargarNotas:Subject<any> = new Subject();
  public nueva_nota_obra_id:number;
  
  public recargarObras:Subject<any> = new Subject();

}
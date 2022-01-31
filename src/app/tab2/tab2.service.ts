import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class Tab2Service {

  constructor() { }

  public recargarNotas:Subject<any> = new Subject();
  public nota_edit_id:number = 0;

}
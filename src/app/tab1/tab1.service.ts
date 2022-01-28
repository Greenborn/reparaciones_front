import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class Tab1Service {

  constructor() { }

  public recargarObras:Subject<any> = new Subject();
  public obra_edit_id:number = 0;

}
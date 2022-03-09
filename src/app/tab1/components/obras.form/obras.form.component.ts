import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Obra } from 'src/app/models/obra';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-obras.form',
  templateUrl: './obras.form.component.html',
  styleUrls: ['./obras.form.component.scss'],
})
export class ObrasFormComponent  implements OnInit, OnDestroy {

    constructor(
        public privateObrasService:         PrivateObrasService,        
        private activatedRoute:             ActivatedRoute,
    ) {
    }

    public model:Obra    = new Obra();
    
    private routeSubj:any;

    ngOnInit() {
        this.routeSubj = this.activatedRoute.paramMap.subscribe(async params => { 
        let id:any = params.get('id');
           if (id !== null){
              this.privateObrasService.get(Number(id), 'expand=imagen');
           }
       })
    }

    ngOnDestroy(){
        this.routeSubj.unsubscribe();
    }

    eliminar_imagen(){
        this.privateObrasService.modelo_edit.imagen_data = undefined;
        this.privateObrasService.modelo_edit.no_image   = true;
        this.privateObrasService.eliminar_info_imagen();
    }
    
}

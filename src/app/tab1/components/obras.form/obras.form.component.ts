import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Obra } from 'src/app/models/obra';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-obras.form',
  templateUrl: './obras.form.component.html',
  styleUrls: ['./obras.form.component.scss'],
})
export class ObrasFormComponent extends ApiConsumer  implements OnInit, OnDestroy {

    constructor(
        private router:                      Router,
        public privateObrasService:         PrivateObrasService,
        private alertController:             AlertController,
        public  loadingController:           LoadingController,
        public ref:                          ChangeDetectorRef,
        
        private activatedRoute:              ActivatedRoute,
        public  authService:                 AuthService,
        
    ) {
        super(alertController, loadingController, ref, authService);
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

    OnDestroy(){
        this.routeSubj.unsubscribe();
    }

    eliminar_imagen(){
        this.privateObrasService.modelo_edit.imagen_data = undefined;
        this.privateObrasService.modelo_edit.no_image   = true;
        this.privateObrasService.eliminar_info_imagen();
    }
    
}

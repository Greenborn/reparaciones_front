import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateNotaService } from 'src/app/services/private.nota.service';

@Component({
  selector: 'app-image.form',
  templateUrl: './image.form.component.html',
  styleUrls: ['./image.form.component.scss'],
})
export class ImageFormComponent extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    private privateNotaService:          PrivateNotaService,
    public  authService:                 AuthService,
  ) { 
    super(alertController, loadingController, ref, authService);
  }

  ngOnInit() {}

  goBack(){
    this.router.navigate([ this.privateNotaService.navigationOrigin ]);
  }

  ingresar(){
    
  }
}

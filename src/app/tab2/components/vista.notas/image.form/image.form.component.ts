import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateImagenService } from 'src/app/services/private.imagen.service';

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
    private privateImageService:         PrivateImagenService,
    public  authService:                 AuthService,
  ) { 
    super(alertController, loadingController, ref, authService);

    if (this.getAllSubj.length == 0){
      this.getAllSubj.push(this.privateImageService.base64ConvertCallBack.subscribe({ next:(p) => {
        this.imagen = { file: p.base64, name:p.anydata.url, id:p.anydata.id };
      }}));
    }
  }

  private getAllSubj:any = [];
  public imagen:any;

  ngOnInit() {

  }

  goBack(){
    this.router.navigate([ this.privateImageService.navigationOrigin ]);
  }

  ingresar(){
    
  }
}

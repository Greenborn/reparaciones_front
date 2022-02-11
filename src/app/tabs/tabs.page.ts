import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from '../models/ApiConsumer';
import { AuthService } from '../modules/autentication/services/auth.service';
import { PrivateNotaService } from '../services/private.nota.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends ApiConsumer{

  constructor(
    public  loadingController:            LoadingController,
    private alertController:              AlertController,
    public  privateNotaService:           PrivateNotaService,
    public changeDetectorRef:             ChangeDetectorRef,
    public  authService:                  AuthService,
  ) {
    super(alertController, loadingController, changeDetectorRef, authService);
  }

  ngOnInit() {
    let interval:number = 1000*300;
    setTimeout(()=>{  this.privateNotaService.pingNotasVencidas({ page:this });  }, interval);
    this.privateNotaService.pingNotasVencidas({ page:this });
  }

}

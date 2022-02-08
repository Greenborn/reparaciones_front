import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from '../models/ApiConsumer';
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
    private privateNotaService:           PrivateNotaService,
    public changeDetectorRef:             ChangeDetectorRef,
  ) {
    super(alertController, loadingController, changeDetectorRef);
  }

}

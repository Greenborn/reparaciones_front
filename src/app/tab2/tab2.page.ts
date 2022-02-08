import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormateoService } from '../services/formateo.service';

import { ApiConsumer } from '../models/ApiConsumer';
import { Router } from '@angular/router';
import { PrivateNotaService } from '../services/private.nota.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page extends ApiConsumer  {

  public max_date:string;

  constructor(
    public  loadingController:            LoadingController,
    private alertController:              AlertController,
    private privateNotaService:           PrivateNotaService,
    public changeDetectorRef:             ChangeDetectorRef,
  ) {
    super(alertController, loadingController, changeDetectorRef);
  }

  ngOnInit() {
    this.privateNotaService.goToNotas({page:this});
  }
}

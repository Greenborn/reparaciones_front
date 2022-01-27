import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormateoService } from '../services/formateo.service';

import { ApiConsumer } from '../models/ApiConsumer';
import { Price } from '../models/price';
import { Router } from '@angular/router';

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
    public  formateoService:              FormateoService,
    private  router:                      Router,
  ) {
    super(alertController, loadingController);
    this.max_date = this.formateoService.getFormatedDate(new Date());
  }

  ngOnInit() {
    this.cargarData();
  }

  async cargarData(){
    
  }

}

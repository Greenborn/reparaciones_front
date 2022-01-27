import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from '../models/ApiConsumer';
import { FormateoService } from '../services/formateo.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page  extends ApiConsumer  {

  constructor(
    private alertController:    AlertController,
    public  loadingController:  LoadingController,
    public  formateoService: FormateoService
  ) {
    super(alertController, loadingController);
  }

  ngOnInit() {
    
  }


}

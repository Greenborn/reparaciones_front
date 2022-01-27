import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
})
export class MarcasComponent  extends ApiConsumer {

  constructor(
    private  router:                      Router,
    private alertController:              AlertController,
    public  loadingController:            LoadingController,
  ) { 
    super(alertController, loadingController);
  }

  ngOnInit() {}

  goBack(){
    this.router.navigate([ '/tabs/tab2' ]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent extends ApiConsumer {

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

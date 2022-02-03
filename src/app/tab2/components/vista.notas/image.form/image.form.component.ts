import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Tab2Service } from 'src/app/tab2/tab2.service';

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
    private tab2Service:                 Tab2Service,
  ) { 
    super(alertController, loadingController, ref);
  }

  ngOnInit() {}

  goBack(){
    this.router.navigate([ this.tab2Service.navigationOrigin ]);
  }
}

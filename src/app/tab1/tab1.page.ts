import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from '../models/ApiConsumer';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Tab1Page  extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:       AlertController,
    public  loadingController:     LoadingController,
    public  ref:                   ChangeDetectorRef
  ) {
    super(alertController, loadingController, ref);
  }

  ngOnInit() {    
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';

@Component({
  selector: 'app-obras.menu',
  templateUrl: './obras.menu.component.html',
  styleUrls: ['./obras.menu.component.scss'],
})
export class ObrasMenuComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private alertController:       AlertController,
    public  loadingController:     LoadingController,
    public  ref:                   ChangeDetectorRef,
  ) { 
    super(alertController, loadingController, ref);
  }

  ngOnInit() {}

}

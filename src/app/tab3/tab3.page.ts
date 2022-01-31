import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../modules/autentication/services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public  loadingController:  LoadingController,
    private authService:        AuthService 
  ) {}

  ngOnInit() {
    
  }

  cerrar_session(){
    this.authService.toLogOut();
  }
}

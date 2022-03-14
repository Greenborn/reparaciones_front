import { Component, OnInit } from '@angular/core';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  constructor(
    public appUIUtilsService:  AppUIUtilsService
  ) { }

  ngOnInit() {
  }

  btnClick( btn:any ){
      btn['callback']();
  }

}

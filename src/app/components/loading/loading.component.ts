import { Component, OnInit, Input } from '@angular/core';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  constructor(
    public appUIUtilsService:  AppUIUtilsService
  ) { }

  ngOnInit() {
  }

}

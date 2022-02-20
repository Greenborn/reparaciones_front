import { Component, OnInit } from '@angular/core';
import { ChangePassword } from '../../models/change-password';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
})
export class ChangePassComponent implements OnInit {

  constructor() { }

  public model:ChangePassword = new ChangePassword();

  ngOnInit() {}

  goBack(){

  }

  ingresar(){

  }
}

import { Component, OnInit, Input } from '@angular/core';

import { MessageComponentService }   from './services/message.component.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  constructor(
    public messageComponentService: MessageComponentService
  ) { }

  private showMessageSubj:any = null;
  ngOnInit() {
  }

  btnClick( btn:any ){
    if ( btn.hasOwnProperty('onClick') ){
      btn.onClick( btn );
    }
    this.dismiss();
  }

  dismiss(){
    this.messageComponentService.dConfig.messageShow = false;
  }

  ngOnDestroy(){
    this.showMessageSubj.unsubscribe();
  }

}

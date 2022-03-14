import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Tab1Page implements OnInit, OnDestroy {

  constructor(

  ) {
  }

  ngOnInit() {    
  }

  ngOnDestroy(){

  }
}

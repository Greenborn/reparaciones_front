import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { TiponotaFormComponent } from './components/tiponota.list/tiponota.form/tiponota.form.component';
import { TiponotaListComponent } from './components/tiponota.list/tiponota.list.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ColorPickerModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
  ],
  declarations: [Tab3Page,TiponotaFormComponent,  TiponotaListComponent]
})
export class Tab3PageModule {}

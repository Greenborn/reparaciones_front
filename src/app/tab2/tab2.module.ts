import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { VistaNotasComponent } from './components/vista.notas/vista.notas.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonicSelectableModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page, VistaNotasComponent]
})
export class Tab2PageModule {}

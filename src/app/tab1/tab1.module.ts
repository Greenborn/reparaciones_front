import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ObrasFormComponent } from './components/obras.form/obras.form.component';
import { ObrasMenuComponent } from './components/obras.menu/obras.menu.component';
import { ObrasListComponent } from './components/obras.list/obras.list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page, ObrasFormComponent, ObrasMenuComponent, ObrasListComponent]
})
export class Tab1PageModule {}

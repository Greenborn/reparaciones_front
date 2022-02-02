import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { EstadosFormComponent } from '../tab3/components/estados.form/estados.form.component';
import { CategoriasFormComponent } from '../tab3/components/categorias.form/categorias.form.component';
import { VistaNotasComponent } from '../tab2/components/vista.notas/vista.notas.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ColorPickerModule,
    TabsPageRoutingModule,
  ],
  declarations: [
    TabsPage, EstadosFormComponent, VistaNotasComponent, CategoriasFormComponent,
  ]
})
export class TabsPageModule {}

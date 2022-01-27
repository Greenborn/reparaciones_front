import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { EmpresasComponent } from '../components/empresas/empresas.component';
import { SucursalesComponent } from '../components/sucursales/sucursales.component';
import { CategoriasComponent } from '../components/categorias/categorias.component';
import { MarcasComponent } from '../components/marcas/marcas.component';
import { ProductosComponent } from '../components/productos/productos.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonicSelectableModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [EmpresasComponent, SucursalesComponent, MarcasComponent, ProductosComponent, CategoriasComponent, Tab2Page]
})
export class Tab2PageModule {}

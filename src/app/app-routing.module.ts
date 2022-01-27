import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { MarcasComponent } from './components/marcas/marcas.component';
import { ProductosComponent } from './components/productos/productos.component';
import { SucursalesComponent } from './components/sucursales/sucursales.component';
import { AuthenticationGuard } from './modules/autentication/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'empresas',   component: EmpresasComponent, canActivate: [AuthenticationGuard] },
  { path: 'sucursales', component: SucursalesComponent, canActivate: [AuthenticationGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthenticationGuard] },
  { path: 'marcas',     component: MarcasComponent, canActivate: [AuthenticationGuard] },
  { path: 'productos',  component: ProductosComponent, canActivate: [AuthenticationGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

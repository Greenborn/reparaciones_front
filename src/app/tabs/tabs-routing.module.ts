import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../modules/autentication/services/auth.guard';
import { ObrasFormComponent } from '../tab1/components/obras.form/obras.form.component';
import { ImageFormComponent } from '../tab2/components/vista.notas/image.form/image.form.component';
import { NotaFormComponent } from '../tab2/components/vista.notas/nota.form/nota.form.component';
import { VistaNotasComponent } from '../tab2/components/vista.notas/vista.notas.component';
import { Tab2Page } from '../tab2/tab2.page';
import { CategoriasFormComponent } from '../tab3/components/categorias.form/categorias.form.component';
import { EstadosFormComponent } from '../tab3/components/estados.form/estados.form.component';
import { TiponotaFormComponent } from '../tab3/components/tiponota.list/tiponota.form/tiponota.form.component';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'tab1',  loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),  canActivate: [AuthenticationGuard]  },
      { path: 'tab1/crear_obra', component: ObrasFormComponent, canActivate: [AuthenticationGuard]   },
      { path: 'tab1/editar_obra', component: ObrasFormComponent, canActivate: [AuthenticationGuard]  },

      { path: 'tab2', component: VistaNotasComponent, canActivate: [AuthenticationGuard]  },
      { path: 'tab2/crear_nota', component: NotaFormComponent, canActivate: [AuthenticationGuard]   },
      { path: 'tab2/editar_nota', component: NotaFormComponent, canActivate: [AuthenticationGuard]  },
      { path: 'tab2/notas', component: VistaNotasComponent, canActivate: [AuthenticationGuard]  },
      
      { path: 'tab3',  loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),  canActivate: [AuthenticationGuard] },
      { path: 'tab3/crear_categoria', component: CategoriasFormComponent, canActivate: [AuthenticationGuard]   },
      { path: 'tab3/editar_categoria', component: CategoriasFormComponent, canActivate: [AuthenticationGuard]  },
      { path: 'tab3/crear_estado', component: EstadosFormComponent, canActivate: [AuthenticationGuard]   },
      { path: 'tab3/editar_estado', component: EstadosFormComponent, canActivate: [AuthenticationGuard]  },
      { path: 'tab3/crear_tipo_nota', component: TiponotaFormComponent, canActivate: [AuthenticationGuard]   },
      { path: 'tab3/editar_tipo_nota', component: TiponotaFormComponent, canActivate: [AuthenticationGuard]  },
      
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
  { path: 'vista_imagen', component: ImageFormComponent, canActivate: [AuthenticationGuard]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

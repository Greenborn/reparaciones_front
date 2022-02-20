import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginViewComponent } from './componentes/login-view/login-view.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule }   from '@angular/common/http';
import { AuthenticationGuard } from './services/auth.guard';
import { IonicModule } from '@ionic/angular';
import { ChangePassComponent } from './componentes/change-pass/change-pass.component';

const routes: Routes = [
  { path: 'login',   component: LoginViewComponent,        },
  { path: 'cambiar_pass',  component: ChangePassComponent, }
];

@NgModule({
  declarations: [
    LoginViewComponent, ChangePassComponent
  ],
  imports: [
    CommonModule, IonicModule.forRoot(),
    FormsModule,ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    AuthenticationGuard
  ],
})
export class AutenticationModule { }

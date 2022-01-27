import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginViewComponent } from './componentes/login-view/login-view.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule }   from '@angular/common/http';
import { AuthenticationGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginViewComponent,
    
  }
];

@NgModule({
  declarations: [
    LoginViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    AuthenticationGuard
  ],
})
export class AutenticationModule { }

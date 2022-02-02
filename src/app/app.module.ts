import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS }   from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { AutenticationModule } from './modules/autentication/autentication.module';
import { AuthInterceptorService } from './modules/autentication/services/auth-interceptor.service';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { NotaFormComponent } from './tab2/components/vista.notas/nota.form/nota.form.component';


@NgModule({
    declarations: [
      AppComponent, NotaFormComponent,
    ],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ColorPickerModule, FormsModule, AutenticationModule, HttpClientModule, IonicSelectableModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
      },],
    bootstrap: [AppComponent]
})
export class AppModule {}

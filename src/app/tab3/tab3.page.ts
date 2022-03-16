import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Categoria } from '../models/categoria';
import { ChangePassComponent } from '../modules/autentication/componentes/change-pass/change-pass.component';
import { AuthService } from '../modules/autentication/services/auth.service';
import { AppUIUtilsService } from '../services/app.ui.utils.service';
import { PrivateCategoriaService2 } from '../services/private.categoria.service2';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy{


  constructor(
    public  authService:              AuthService,
    private navController:            NavController,
    public  privateCategoriaService:  PrivateCategoriaService2,
    public  modalController:          ModalController,

    private appUIUtilsService:        AppUIUtilsService
  ) {
  } 

    ngOnInit() {
        //NOS ASEGURAMOS DE CARGAR LAS CATEGORIAS
        if ( this.privateCategoriaService.all.length == 0){
            this.appUIUtilsService.presentLoading({ message: "Consultando listado de categorías..." });
            this.privateCategoriaService.getAll();
        }
    }

    cerrar_session(){
        this.authService.toLogOut();
    }

    nueva_categoria(){
        this.privateCategoriaService.goToNueva();
    }

    editar_categoria( categoria:Categoria ){
        this.privateCategoriaService.goToEdit( categoria.id );
    }

    eliminar_categoria( categoria:Categoria ){
        this.privateCategoriaService.delete( categoria.id );
    }

    ngOnDestroy(){
    }

    async cambiar_pass(){
        let modal = await this.modalController.create({
            component: ChangePassComponent,
            componentProps: {
            'modal': this.modalController
            }
        });
        return await modal.present();
    }
}

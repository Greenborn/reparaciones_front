import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiConsumer } from '../models/ApiConsumer';
import { ChangePassComponent } from '../modules/autentication/componentes/change-pass/change-pass.component';
import { AuthService } from '../modules/autentication/services/auth.service';
import { PrivateCategoriaService } from '../services/private.categoria.service';
import { Tab3Service } from './services/tab3.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page extends ApiConsumer  implements OnInit, OnDestroy{

  public categorias:any = [];

  private recargarCategoriasSubs:any;

  constructor(
    public  loadingController:        LoadingController,
    public  authService:              AuthService,
    private alertController:          AlertController,
    public ref:                       ChangeDetectorRef,
    private router:                   Router,
    private tab3Service:              Tab3Service,
    private privateCategoriaService:  PrivateCategoriaService,
    public  modalController:          ModalController,
  ) {
    super(alertController, loadingController, ref, authService);
  }

  ngOnInit() {
    if (this.recargarCategoriasSubs == undefined){
      this.recargarCategoriasSubs = this.tab3Service.recargarCategoria.subscribe({ next:() => {
        this.loadingEspecificData(this.privateCategoriaService, '',   'categorias', 'Consultando categorias.');
      }});
    }
    this.tab3Service.recargarCategoria.next();
  }

  cerrar_session(){
    this.authService.toLogOut();
  }

  nueva_categoria(){
    this.router.navigate([ '/tabs/tab3/crear_categoria' ]);
  }

  editar_categoria(categoria){
    this.tab3Service.categoria_edit_id = categoria.id;
    this.router.navigate([ '/tabs/tab3/editar_categoria' ]);
  }

  ngOnDestroy(){
    this.recargarCategoriasSubs.unsubscribe();
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

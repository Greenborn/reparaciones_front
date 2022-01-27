import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { PrivateCategoryService } from 'src/app/services/private.category.service';
import { Categoria } from './models/Categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent  extends ApiConsumer {

  constructor(
    private  router:                      Router,
    private alertController:              AlertController,
    public  loadingController:            LoadingController,
    private privateCategoryService:       PrivateCategoryService
  ) { 
    super(alertController, loadingController);
  }

  public model:Categoria = new Categoria();
  public listado_categorias:any = [];

  ngOnInit() {
    this.loadingEspecificData(this.privateCategoryService, '',   'listado_categorias', 'Consultando categorías.');
  }

  goBack(){
    this.router.navigate([ '/tabs/tab2' ]);
  }

  borrarRootCategory(){
    this.model.root_category_id = undefined;
  }

  async ingresar(){
    if (this.model.name == '' || this.model.name == undefined){
      super.displayAlert("Debe especificar un nombre."); return false;
    }

    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    this.privateCategoryService.post(this.model).subscribe(
      ok => {
        super.displayAlert("Nuevo registro de categoría creado, a partir de ahora aparecerá en las búsquedas");
        loading.dismiss();
      },
      err => {
        loading.dismiss();
      }
    );
  }
}

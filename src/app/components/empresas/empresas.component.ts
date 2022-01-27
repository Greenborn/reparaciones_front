import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateEnterpriceService } from 'src/app/services/private.enterprice.service';
import { PublicEnterpriceItemService } from 'src/app/services/public.enterprice.item.service';
import { EmpresaForm } from './model/empresa.form';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
})
export class EmpresasComponent  extends ApiConsumer {

  constructor(
    private authService:                 AuthService,
    private router:                      Router,
    private publicEnterpriceItemService: PublicEnterpriceItemService,
    public  loadingController:           LoadingController,
    private privateEnterpriceService:    PrivateEnterpriceService,
    private alertController:             AlertController
  ) { 
    super(alertController, loadingController);
  }

  public model:EmpresaForm = new EmpresaForm();
  public listado_rubros:any = [];

  goBack(){
    this.router.navigate([ '/tabs/tab2' ]);
  }

  async ingresar(){
    if (this.model.name == undefined || this.model.name == ''){ super.displayAlert("Debe especificar un nombre."); return false; }
   // if (this.model.rubros.length > 0){ super.displayAlert("Debe especificar al menos un rubro.");  }

    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    this.privateEnterpriceService.post(this.model).subscribe(
      ok => {
        super.displayAlert("Nuevo registro de comercio creado, a partir de ahora aparecerá en las búsquedas");
        loading.dismiss();
      },
      err => {
        loading.dismiss();
      }
    );
  }

  ngOnInit() {
    this.loadingEspecificData(this.publicEnterpriceItemService, '',   'listado_rubros', 'Consultando rubros.');
  }

}

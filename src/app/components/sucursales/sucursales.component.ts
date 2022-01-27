import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { PrivateBranchService } from 'src/app/services/private.branch.service';
import { PublicEnterpriceService } from 'src/app/services/public.enterprise.service';
import { Sucursal } from './model/sucursal';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss'],
})
export class SucursalesComponent  extends ApiConsumer {

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    private publicEnterpriceService:     PublicEnterpriceService,
    private privateBranchService:        PrivateBranchService,
    private router:                      Router,
  ) {
    super(alertController, loadingController);
  }

  public model:Sucursal = new Sucursal();
  public listado_comercios:any = [];

  ngOnInit() {
    this.loadingEspecificData(this.publicEnterpriceService, '',   'listado_comercios', 'Consultando comercios.');
  }

  goBack(){
    this.router.navigate([ '/tabs/tab2' ]);
  }

  async ingresar(){
    if (this.model.name == undefined || this.model.name == ''){ super.displayAlert("Debe especificar un nombre.");  }
    if (this.model.address_road == undefined || this.model.address_road == ''){ super.displayAlert("Debe especificar una calle.");  }
    if (this.model.address_number == undefined || this.model.address_number == ''){ super.displayAlert("Debe especificar un número.");  }
    if (this.model.enterprise_id == undefined){ super.displayAlert("Debe especificar una comercio.");  }
    this.model.enterprise_id = this.model.enterprise_id['id'];

    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    this.privateBranchService.post(this.model).subscribe(
      ok => {
        super.displayAlert("Nuevo registro de sucursal creado, a partir de ahora aparecerá en las búsquedas.");
        loading.dismiss();
      },
      err => {
        loading.dismiss();
        super.displayAlert("No se pudo guardar la sucursal, reintente más tarde.");
      }
    );
  }

}

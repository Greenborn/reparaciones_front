import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Obra } from 'src/app/models/obra';
import { PrivateObrasService } from 'src/app/services/private.obras.service';
import { Tab1Service } from '../../tab1.service';

@Component({
  selector: 'app-obras.form',
  templateUrl: './obras.form.component.html',
  styleUrls: ['./obras.form.component.scss'],
})
export class ObrasFormComponent extends ApiConsumer  implements OnInit, OnDestroy {

  constructor(
    private router:                      Router,
    private privateObrasService:         PrivateObrasService,
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    private tab1Service:                 Tab1Service,
    public ref:                          ChangeDetectorRef,
  ) {
    super(alertController, loadingController, ref);
  }

  public model:Obra    = new Obra();
  public accion:string = 'Nueva';

  private router_subs:any;

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_obra') != -1) {
          this.accion = 'Nueva';
        } else if (event.url.search('editar_obra') != -1){
          this.accion = 'Editar';
          
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          this.privateObrasService.get(this.tab1Service.obra_edit_id).subscribe(
            ok => {
              loading.dismiss();
              this.model = ok;
            },
            err => {
              loading.dismiss();
            }
          );
        }
      });
    }
  }

  OnDestroy(){
    this.router_subs.unsubscribe();
  }

  goBack(){
    this.router.navigate([ '/tabs/tab1' ]);
  }

  async ingresar(){
    const loading = await this.loadingController.create({ message: "Por favor espere..." });

    if (this.accion == 'Nueva'){
      this.privateObrasService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Obra creado.");
          loading.dismiss();
          this.tab1Service.recargarObras.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateObrasService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado la obra.");
          loading.dismiss();
          this.tab1Service.recargarObras.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    }
    
  }
}

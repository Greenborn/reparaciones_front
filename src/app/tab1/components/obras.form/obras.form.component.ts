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
  public file_field:any;

  private router_subs:any;
  private imageOnSuccessSubj:any;

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_obra') != -1) {
          this.accion = 'Nueva';
          this.model = new Obra();
          this.image_data = undefined;
        } else if (event.url.search('editar_obra') != -1){
          this.accion = 'Editar';
          this.image_data = undefined;
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

    if (this.imageOnSuccessSubj == undefined){
      this.imageOnSuccessSubj = this.imageOnSuccess.subscribe({ next:(p:any) => {
        this.model.imagen_data = this.image_data;
      }});
    }
  }

  eliminar_imagen(){
    this.image_data        = undefined;
    this.model.imagen_data = undefined;
    this.file_field        = '';
  }

  OnDestroy(){
    this.router_subs.unsubscribe();
    this.imageOnSuccessSubj.unsubscribe();
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

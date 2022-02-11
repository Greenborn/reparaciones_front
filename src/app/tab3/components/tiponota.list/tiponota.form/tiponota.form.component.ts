import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { TipoNota } from 'src/app/models/tipo.nota';
import { AuthService } from 'src/app/modules/autentication/services/auth.service';
import { PrivateTipoNotaService } from 'src/app/services/private.tipo.nota.service';
import { Tab3Service } from 'src/app/tab3/services/tab3.service';

@Component({
  selector: 'app-tiponota-form',
  templateUrl: './tiponota.form.component.html',
  styleUrls: ['./tiponota.form.component.scss'],
})
export class TiponotaFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  public accion:string = 'Nuevo';
  public model:TipoNota = new TipoNota();

  private router_subs:any;

  constructor(
    public  loadingController:        LoadingController,
    private alertController:          AlertController,
    public ref:                       ChangeDetectorRef,
    private router:                   Router,
    private privateTipoNotaService:   PrivateTipoNotaService,
    private tab3Service:              Tab3Service,
    public  authService:              AuthService,
  ) {
    super(alertController, loadingController, ref, authService);
  }

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_tipo_nota') != -1) {
          this.accion = 'Nuevo';
        } else if (event.url.search('editar_tipo_nota') != -1){
          this.accion = 'Editar';
          
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          this.privateTipoNotaService.get(this.tab3Service.tipo_nota_edit_id).subscribe(
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
    this.router.navigate([ '/tabs/tab3' ]);
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('color') || this.model.color == ''){
      super.displayAlert("Debe definir un color para el tipo de nota."); return false;
    }

    if ( !this.model.hasOwnProperty('nombre') || this.model.nombre == ''){
      super.displayAlert("Debe definir un nombre para tipo de nota."); return false;
    }

    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    if (this.accion == 'Nuevo'){
      this.privateTipoNotaService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Tipo de Nota creado.");
          loading.dismiss();
          this.tab3Service.recargarTipoNota.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateTipoNotaService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado el Tipo de Nota.");
          loading.dismiss();
          this.tab3Service.recargarTipoNota.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    }
  }
}

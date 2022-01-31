import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Categoria } from 'src/app/models/categoria';
import { PrivateCategoriaService } from 'src/app/services/private.categoria.service';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-categorias.form',
  templateUrl: './categorias.form.component.html',
  styleUrls: ['./categorias.form.component.scss'],
})
export class CategoriasFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Categoria    = new Categoria();

  private router_subs:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    private privateCategoriaService:     PrivateCategoriaService,
    private tab3Service:                 Tab3Service
  ) { 
    super(alertController, loadingController, ref);
  }

  ngOnInit() {
    this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
      if (event.url.search('crear_categoria') != -1) {
        this.accion = 'Nueva';
      } else if (event.url.search('editar_categoria') != -1){
        this.accion = 'Editar';
        
        const loading = await this.loadingController.create({ message: "Por favor espere..." });
        this.privateCategoriaService.get(this.tab3Service.categoria_edit_id).subscribe(
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

  OnDestroy(){
    this.router_subs.unsubscribe();
  }
  
  goBack(){
    this.router.navigate([ '/tabs/tab3' ]);
  }

  async ingresar(){
    if ( !this.model.hasOwnProperty('color') || this.model.color == ''){
      super.displayAlert("Debe definir un color para la categoría."); return false;
    }

    if ( !this.model.hasOwnProperty('nombre') || this.model.nombre == ''){
      super.displayAlert("Debe definir un nombre para la categoría."); return false;
    }
    
    const loading = await this.loadingController.create({ message: "Por favor espere..." });
    if (this.accion == 'Nueva'){
      this.privateCategoriaService.post(this.model).subscribe(
        ok => {
          super.displayAlert("Nuevo registro de Categoría creado.");
          loading.dismiss();
          this.tab3Service.recargarCategoria.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    } else if (this.accion == 'Editar'){
      this.privateCategoriaService.put(this.model, this.model.id).subscribe(
        ok => {
          super.displayAlert("Se ha modificado la categoría.");
          loading.dismiss();
          this.tab3Service.recargarCategoria.next();
          this.goBack();
        },
        err => {
          loading.dismiss();
        }
      );
    }
  }
}

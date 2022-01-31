import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Estado } from 'src/app/models/estado';
import { PrivateEstadoService } from 'src/app/services/private.estado.service';
import { Tab3Service } from '../../services/tab3.service';

@Component({
  selector: 'app-estados.form',
  templateUrl: './estados.form.component.html',
  styleUrls: ['./estados.form.component.scss'],
})
export class EstadosFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Estado    = new Estado();

  private router_subs:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private tab3Service:                 Tab3Service,
    private router:                      Router, 
    private privateEstadoService:        PrivateEstadoService
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
        this.privateEstadoService.get(this.tab3Service.estado_edit_id).subscribe(
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

}

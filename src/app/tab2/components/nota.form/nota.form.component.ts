import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApiConsumer } from 'src/app/models/ApiConsumer';
import { Nota } from 'src/app/models/nota';
import { PrivateNotaService } from 'src/app/services/private.nota.service';
import { Tab2Service } from '../../tab2.service';

@Component({
  selector: 'app-nota.form',
  templateUrl: './nota.form.component.html',
  styleUrls: ['./nota.form.component.scss'],
})
export class NotaFormComponent  extends ApiConsumer  implements OnInit, OnDestroy {

  public accion:string = 'Nueva';
  public model:Nota    = new Nota();

  private router_subs:any;

  constructor(
    private alertController:             AlertController,
    public  loadingController:           LoadingController,
    public ref:                          ChangeDetectorRef,
    private router:                      Router,
    private privateNotaService:          PrivateNotaService,
    private tab2Service:                 Tab2Service
  ) {
    super(alertController, loadingController, ref);
  }

  ngOnInit() {
    if (this.router_subs == undefined){
      this.router_subs = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
        if (event.url.search('crear_nota') != -1) {
          this.accion = 'Nueva';
        } else if (event.url.search('editar_nota') != -1){
          this.accion = 'Editar';
          
          const loading = await this.loadingController.create({ message: "Por favor espere..." });
          this.privateNotaService.get(this.tab2Service.nota_edit_id).subscribe(
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
    this.router.navigate([ '/tabs/tab2' ]);
  }

}
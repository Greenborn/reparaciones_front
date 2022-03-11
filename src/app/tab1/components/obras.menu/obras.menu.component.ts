import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AppUIUtilsService } from 'src/app/services/app.ui.utils.service';
import { PrivateNotaService2 } from 'src/app/services/private.nota.service2';
import { PrivateObrasService } from 'src/app/services/private.obras.service';

@Component({
  selector: 'app-obras.menu',
  templateUrl: './obras.menu.component.html',
  styleUrls: ['./obras.menu.component.scss'],
})
export class ObrasMenuComponent implements OnInit, OnDestroy {

  @Input() obra: string;
  @Input() modal: any;

    constructor(
        private alertController:       AlertController,

        private privateObrasService:   PrivateObrasService,
        private privateNotaService:    PrivateNotaService2,
        private appUIUtilsService:     AppUIUtilsService,
    ) { 
    }

    ngOnInit() {
    }

    ngOnDestroy(){
    }

    volver(){
        this.modal.dismiss();
    }

    nueva_nota(obra){
        this.privateNotaService.goToNueva({ obra_id:obra.id, navigationOrigin:'/tabs/tab1' });
        this.volver();
    }

    editar_obra(obra:any){
        this.privateObrasService.goToEdit(obra.id);
        this.volver();
    }

    ver_notas(obra:any){
        this.privateNotaService.goToNotas({ 
            obra:        obra.id, 
            nombre_obra: obra.nombre_alias, 
            getParams:   'expand=categoria,obra,tipoNota'
        });
        this.volver();
    }

    async eliminar_obra(obra:any){
        const alert = await this.alertController.create({
                header: 'Atención',
                message: 'Está por eliminar la obra "' + obra.nombre_alias + '" y se perderán sus notas asociadas ¿desea continuar?.',
                buttons: [{
                text: 'No',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {}
            }, {
                text: 'Si',
                cssClass: 'danger',
                handler: () => {
                    //luego de borrar se fuerza la deteccion de cambios
                    //se pasa por aca por que al parecer necesita ser llamado desde una pagina
                    this.privateObrasService.borrar_obra(obra);
                    this.volver();
                }
            }]
        });
        await alert.present();
    }

    async desabilitar_obra(obra:any){
        obra.habilitada = 0;
        this.appUIUtilsService.presentLoading({ message: 'Desabilitando obra: ' + obra.nombre_alias});
        
        this.privateObrasService.put(obra,obra.id);
        this.volver();
    }

    async habilitar_obra(obra:any){
        obra.habilitada = 1;
        this.appUIUtilsService.presentLoading({ message: 'Habilitando obra: ' + obra.nombre_alias});
        
        this.privateObrasService.put(obra,obra.id);
        this.volver();
    }

}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
            obra_id:     obra.id, 
            nombre_obra: obra.nombre_alias, 
            getParams:   'expand=categoria,obra,tipoNota'
        });
        this.volver();
    }

    async eliminar_obra(obra:any){
        this.appUIUtilsService.displayAlert('Está por eliminar la obra "' + obra.nombre_alias + '" y se perderán sus notas asociadas ¿desea continuar?.', 'Atención', [
            { text:'No', css_class: 'btn-primary',callback:()=> { this.appUIUtilsService.dissmissAlert(); } },
            { text:'Si', css_class: 'btn-warning',callback:()=> { 
                this.privateObrasService.borrar_obra(obra);
                this.volver(); 
            } }
        ]);
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

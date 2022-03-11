import { Component } from '@angular/core';
import { PrivateNotaService2 } from '../services/private.nota.service2';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(
        public  privateNotaService:           PrivateNotaService2,
    ) {
    }

    ngOnInit() {
        this.privateNotaService.obtenerNotasVencidas();
    }

}

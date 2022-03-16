import { Component } from '@angular/core';
import { PrivateNotaService } from '../services/private.nota.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(
        public  privateNotaService:           PrivateNotaService,
    ) {
    }

    ngOnInit() {
        this.privateNotaService.obtenerNotasVencidas();
    }

}

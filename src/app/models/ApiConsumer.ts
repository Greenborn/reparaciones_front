import { Component, OnDestroy } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { Observable, Subject } from "rxjs";
import { first, takeUntil } from "rxjs/operators";

@Component({
  template: ''
})
export abstract class ApiConsumer implements OnDestroy {

  // // https://dev.to/re4388/use-rxjs-takeuntil-to-unsubscribe-1ffj
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    // private name: string,
    protected alertCtrl: AlertController,
    protected loadingController: LoadingController
  ) { }

  protected fetch<T>(callback: CallableFunction): Observable<T> {
    // console.log(`fetching api desde ${this.name}` ,)
    return callback().pipe(
      takeUntil(this.unsubscribe$)
    )
  }

async displayAlert(message: string) {
  // this.alertCtrl.dismiss();
  (await this.alertCtrl.create({
    header: 'Info',
    message,
    buttons: [{
      text: 'Ok',
      role: 'cancel'
    }]
  })).present()
  }

  ngOnDestroy() {
  // ionViewWillLeave() {
    // console.log(`unsuscribed fetch`)
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async loadingEspecificData( service:any, params:string,dataOut:string, loadingText:string, recursionCount:number = 0 ){
    const loading = await this.loadingController.create({ message: loadingText });
    await loading.present();
    service.getAll(params).subscribe(
      ok => {
        loading.dismiss();
        this[dataOut] = ok;
      },
      err => {
        loading.dismiss();
        if (recursionCount > 100){
          this[dataOut] = [];
        }
        return this.loadingEspecificData(service, params, dataOut, loadingText,recursionCount+1);
        
      }
    );
  }
}


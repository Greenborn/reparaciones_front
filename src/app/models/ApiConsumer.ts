import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
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
    protected loadingController: LoadingController,
    protected ref:               ChangeDetectorRef,
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

  public getAllSubject:Subject<any> = new Subject();
  async loadingEspecificData( service:any, params:string,dataOut:string, loadingText:string, recursionCount:number = 0 ){
    const loading = await this.loadingController.create({ message: loadingText });
    await loading.present();
    service.getAll(params).subscribe(
      ok => {
        loading.dismiss();
        this[dataOut] = ok;
        this.getAllSubject.next({service:service, data:this[dataOut]});
        this.ref.detectChanges();
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

  public img_hfi_result = null;
  public image_data:any;
  handleFileInput(files: FileList, params:any = {}) {
    let me     = this;
    let file   = files[0];
    let reader = new FileReader();
    
    let on_error   = ()=>{};
    let on_success = ()=>{};
    if (params.hasOwnProperty('on_error'))    on_error   = params.on_error;
    if (params.hasOwnProperty('on_success'))  on_success = params.on_success;

    this.img_hfi_result = null;
   
    if (!file) return;

    reader.readAsDataURL(file);
    reader.onload = function (i) {
        me.image_data =  { file: reader.result, name:file.name };
        on_success();
    };
    reader.onerror = function (error) {
        on_error();
        return false;
    };
  }
}


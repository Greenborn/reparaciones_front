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
        if (dataOut != ''){
          this[dataOut] = ok;
        }
        this.getAllSubject.next({service:service, data:this[dataOut]});
        this.ref.detectChanges();
      },
      err => {
        loading.dismiss();
        if (recursionCount > 100 && dataOut != ''){
          this[dataOut] = [];
        }
        return this.loadingEspecificData(service, params, dataOut, loadingText,recursionCount+1);
        
      }
    );
  }

  public img_hfi_result = null;
  public image_data:any;

  public imageOnSuccess:Subject<any> = new Subject();
  public imageOnError:Subject<any> = new Subject();
  handleFileInput(files: FileList) {
    let me     = this;
    let file   = files[0];
    let reader = new FileReader();
    
    this.img_hfi_result = null;
   
    if (!file) return;

    reader.readAsDataURL(file);
    reader.onload = function (i) {
        me.image_data =  { file: reader.result, name:file.name };
        me.imageOnSuccess.next(me.image_data);
    };
    reader.onerror = function (error) {
        me.imageOnError.next(error);
        return false;
    };
  }

  public base64ConvertCallBack:Subject<any> = new Subject();
  public imgUrlToBase64(url, anydata:any = {}) {
      let xhr = new XMLHttpRequest();
      let me = this;
      xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            me.base64ConvertCallBack.next({base64:reader.result, anydata:anydata});
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
  }
}


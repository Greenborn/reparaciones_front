import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { Observable, Subject } from "rxjs";
import { first, takeUntil } from "rxjs/operators";
import { AuthService } from "../modules/autentication/services/auth.service";

@Component({
  template: ''
})
export abstract class ApiConsumer implements OnDestroy {

  // // https://dev.to/re4388/use-rxjs-takeuntil-to-unsubscribe-1ffj
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    protected alertCtrl:         AlertController,
    protected loadingController: LoadingController,
    protected ref:               ChangeDetectorRef,
    protected authService:       AuthService,
  ) { }

  protected fetch<T>(callback: CallableFunction): Observable<T> {
    return callback().pipe(
      takeUntil(this.unsubscribe$)
    )
  }

async displayAlert(message: string) {
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
        if (!this.authService.logedIn()){
          recursionCount = 200;
        }
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

}


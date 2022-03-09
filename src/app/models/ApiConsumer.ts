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

  private loading:any = null;
    async presentLoading( loadingParams ){
        //si ya hay un loading instanciado lo cerramos y reemplazom por el nuevo
        if (this.loading !== null){
            this.loading.dismiss();
            this.loading = null;
        }
        this.loading = await this.loadingController.create( loadingParams );
        this.loading.present();
    }

    dissmisLoading(){
        if (this.loading !== null){
            this.loading.dismiss();
            this.loading = null;
        }
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
        
        if (recursionCount > 100 && dataOut != ''){
          this[dataOut] = [];
          return false;
        }
        if (this.authService.logedIn()){
          return this.loadingEspecificData(service, params, dataOut, loadingText,recursionCount+1);
        }
        
      }
    );
  }

  public img_hfi_result = null;
  public image_data:any;
  public file_data:any;
  public file_data_extension:string;

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
      me.file_data_extension = String(file.name).split('.').pop();
      switch (me.file_data_extension){
        case 'pdf': case 'otf': case 'doc': case 'docx': case 'xls': case 'csv': case 'ott': case 'ods': case 'txt':
          me.file_data  =  { file: reader.result, name:file.name };
        break;

        case 'png': case 'jpg': case 'jpeg': case 'webp': case 'bmp':
          me.image_data =  { file: reader.result, name:file.name };
        break;
      }
      me.imageOnSuccess.next({ file: reader.result, name:file.name, extension: me.file_data_extension });
    };
    reader.onerror = function (error) {
        me.imageOnError.next(error);
        return false;
    };
  }

}


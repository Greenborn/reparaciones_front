export class MessageComponentConfig {
  public title:string        = 'Atención';
  public content:string      = '';
  public footerElements:any  = '';
  public messageShow:boolean = false;

  public footerButtons:any = [
    { buttonsClass: 'btn-outline-info', text: 'Aceptar' }
  ];
}

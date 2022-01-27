//Este componete tiene como finalida centralizar el formateo de datos generícos
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormateoService {

  constructor() { }

  public DECIMAL_SEPARATOR:string = ",";
  public GROUP_SEPARATOR:string   = ".";
  public CUIL_SEPARATOR:string    = '-';
  public DATE_SEPARATOR:string    = '/';
  public DIAS_POR_MES             = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];

  public GTMZone = -3;

  public ISODate:string  = '';
  public anio:number    = 0;
  public mes:number     = 0;
  public dia:number     = 0;
  public hora:number    = 0;
  public minuto:number  = 0;
  public segundo:number = 0;

  public MAYOR = 1;
  public MENOR = -1;
  public IGUAL = 0;

  addZero( i:any ) {
    if (Number(i) < 10) {
      i = "0" + String( i );
    }
    return i;
  }

  /////////////////////////
  ///// TARJETAS
  formatCardNumber(valString:any) {
    if (!valString) {
        return '';
    }
    let val    = valString.toString();
    let number = this.unFormatMoney(val);

    return number.replace(/\B(?=(?:\d{4})+(?!\d))/g, '-');
  }

  ////////////////////////
  //// Horario
  getTimeFromTimeStamp( ts:number ){
    return this.getTimeStringFromDate( new Date( ts * 1000 ) );
  }

  getTimeStringFromDate( d:Date ){
    return this.addZero(d.getHours()) + ':' + this.addZero(d.getMinutes()) + ':' + this.addZero(d.getSeconds());
  }

  getTimeStampFTimeStr( t:any ){
    let out:number = 0;
    t = String( t ).split( ':' );
    out += Number( t[0] ) * 60 * 60;
    out += Number( t[1] ) * 60;
    return out;
  }

  /////////////////////////
  //// PORCENTAGE
  getPorcentajeFNumber( num:number ){
    return String(num) + ' %';
  }

  /////////////////////////
  //// FECHAS          ////

  getTimeStampFDateArr( d:any ){
    if (d === undefined){
      return undefined;
    }

    let f = new Date(d.year, d.month-1, d.day);
    return f.getTime() / 1000;
  }

  getSDateFromTimeStamp( t:number ){
    let f = new Date( t * 1000 );
    return this.getStringDate( f );
  }

  getSDateToDateITS( t:number ){
    let f = new Date( t * 1000 );
    return f.getFullYear()+'-'+("0" + (f.getMonth() + 1)).slice(-2)+'-'+("0" + f.getDate()).slice(-2);
  }

  getTimeStampFDateStr( d:string ){
    return new Date( d ).getTime() / 1000;
  }

  getFormatedDate(f:any = '', format:string='YYYY-MM-DD'){
      if (f !== ''){
        let d : any = this.getStringDate(f).split( this.DATE_SEPARATOR );
        // esto se puede hacer de forma mejor pero, en otro momento me
        if (format == 'YYYY-MM-DD') { return d[2]+"-"+d[1]+"-"+d[0]; }
        if (format == 'DD-MM-YYYY') { return d[0]+"-"+d[1]+"-"+d[2]; }
      }
      return '';
  }

  getDateGoogle(f:any){
    return f.getFullYear()+'-'+("0" + (f.getMonth() + 1)).slice(-2)+'-'+("0" + f.getDate()).slice(-2)+"+"+("0" + f.getHours()).slice(-2)+':'+("0" + f.getMinutes()).slice(-2);
  }

  getStringDate(d:any){
    return this.addZero( d.getDate() ) + this.DATE_SEPARATOR + this.addZero( (Number( d.getMonth() ) + 1) )  + this.addZero( this.DATE_SEPARATOR + d.getFullYear() );
  }

  //////////////////////////
  //// NÚMEROS           ///
  getFloatLA(val:any){
     if (!val) { return ''; }
     val = val.toString().split( this.GROUP_SEPARATOR );
     if ( val.length < 2 ){
      val[1]='00';
     }
     return val[0]+this.DECIMAL_SEPARATOR+val[1].slice(0, 2);
  }


  //////////////////////////
  //// MONEDAS          ////
  getLocaleMoneyF(v:any, signo:number=1){
    let val:string;
    let va2 = String(v).split(this.GROUP_SEPARATOR);

    if (va2.length == 2){
      if (va2[1].length == 1){
        va2[1] = String(va2[1]) +'0';
      } else if(va2[1].length > 2) {
        va2[1] = String(va2[1]).slice(0,1);
      }

      val = va2[0]+','+va2[1];
    } else {
      val = va2[0]+',00';
    }

    if (val[val.length-1] == '-'){ signo = -1; }

    let parts = this.unFormatMoney(val).split(this.DECIMAL_SEPARATOR);
    if(parts[1]) { parts[1] = parts[1].slice(0, 2);}
    if(val.slice(-1)===this.DECIMAL_SEPARATOR) {parts[0]+=this.DECIMAL_SEPARATOR;}
    let s = '';

    if(signo == -1){
      s='-';
    }

    let ent = parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);
    if (ent == ''){ ent = '0'; }

    return "$ "+s+ ent + (!parts[1] ? '' :this.DECIMAL_SEPARATOR+ parts[1]);
  }

  unFormatMoney(val:any) {
      if (!val) { return ''; }

      val = val.replace(/^0+/, '');
      let s:string='';
      if (this.GROUP_SEPARATOR === ',') {
        s=val.replace(/[^0-9\.]/g, '');
      } else { s=val.replace(/[^0-9,]/g, '');}
      return s;
  }

  getFloat(val:any):number {
      if (!val) { return undefined;  }

      val = (val as string).replace(/^0+/, '');
      let s:string='';
      s=val.replace(/[^0-9,]/g, '');
      s=s.replace(',','.');
      if(s==".00") { s='0.00'; }
      return Number(s);
  }

  esSoloNumber(n:any){  let patron = /^[0-9]*$/;  return patron.test(<string> n); }

  //////////////////////////
  ///// BOOLEAN
  getTextOfBoolean( bool:number ){
    if ( bool ) {
      return 'Si';
    }
    return 'No';
  }

}

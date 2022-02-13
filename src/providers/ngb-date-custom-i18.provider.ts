import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { TranslationWidth } from '@angular/common';

@Injectable()
export class NgbDateCustomI18 extends NgbDatepickerI18n {
  getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
    return this.days_l[weekday];
  }

  public days_l  = ['','L', 'M', 'M', 'J', 'V', 'S', 'D'];
  public month_s = ['','Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  public month_f = ['','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  

  getWeekdayShortName(weekday: number){
      return this.days_l[weekday];
  };

  getMonthShortName(month: number): string{
    return this.month_s[month];
  }

  getMonthFullName(month: number): string{
    return this.month_f[month];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
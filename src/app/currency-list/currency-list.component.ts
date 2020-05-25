import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { ICurrencyRate } from '../Interfaces/ICurrency-rate';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit, OnDestroy {

  allCurrencies:string[]
  baseCurrency:string = 'EUR';
  baseDate:Date;
  currencyRate:ICurrencyRate;
  loading : boolean = true;
  errorMessage : string;
  warningMessage : string;
  ratesSubscription:Subscription;
  currenciesSubsciption:Subscription;

  constructor(private _dataService:DataService, public datepipe: DatePipe) { 
  }

  ngOnInit() {
    this.currenciesSubsciption = this.currenciesSubsciption = this._dataService.GetCurrencies().subscribe({
      next:currencies=>{
        this.allCurrencies =currencies;
        // THis API is fun, when base currency is EUR, it is not provided in list of currencies, otherwise base currency IS in the list
        // Lets add it at least in the selection
        if(this.allCurrencies.indexOf('EUR') === -1){this.allCurrencies.push('EUR');}
      },
      error:err=>{
        this.errorMessage = 'Cannot load currencies, ' + err
      }

    });
    this.Reload();
  }

  ngOnDestroy(): void {
    if(this.ratesSubscription) this.ratesSubscription.unsubscribe();
    if(this.currenciesSubsciption) this.currenciesSubsciption.unsubscribe();
  }

  Reload()
  {
    if(this.ratesSubscription) this.ratesSubscription.unsubscribe();
    this.errorMessage = this.warningMessage = '';
    this.loading = true;
    let date: string = 'latest';
    if(this.baseDate !== undefined)
    {
      date = this.datepipe.transform(this.baseDate, 'yyyy-MM-dd')
    }

    this.ratesSubscription = this._dataService.GetRates(this.baseCurrency, date).subscribe({
      next: currencyRate => {
        this.currencyRate  = currencyRate;
        if(this.baseDate !== undefined && this.baseDate !== currencyRate.date)
        {
            this.warningMessage = `Could not get rates for ${this.baseDate}, showing ${currencyRate.date} instead`
        }
        this.baseDate = currencyRate.date;
        this.baseCurrency = currencyRate.base
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = 'Cannot load data -' + err.message
      }
    });

  }

}

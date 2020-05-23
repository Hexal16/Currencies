import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { ICurrencyRate } from '../Interfaces/ICurrency-rate';
import { Subscription } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit, OnDestroy {

  allCurrencies:string[]
  baseCurrency:string = 'EUR';
  baseDate:Date = new Date();
  currencyRate:ICurrencyRate;
  loading : boolean = true;
  errorMessage : string;
  ratesSubscription:Subscription;
  constructor(private _dataService:DataService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.Reload();
  }

  ngOnDestroy(): void {
    this.ratesSubscription.unsubscribe();
  }

  Reload()
  {
    this.loading = true;
    this._dataService.GetCurrencies().subscribe({
      next:currencies=>{
        this.allCurrencies =currencies;
        // THis API is fun, when base currency is EUR, it is not provided in list of currencies, otherwise base currency IS in the list
        // Lets add it at least in the selection
        if(this.allCurrencies.indexOf(this.baseCurrency) === -1)
        {
          this.allCurrencies.push(this.baseCurrency);
        }
      },
      error:err=>{
        this.errorMessage = 'Cannot load currencies, ' + err
      }

    });

    this.ratesSubscription = this._dataService.GetRates(this.baseCurrency, this.datepipe.transform(this.baseDate, 'yyyy-MM-dd')).subscribe({
      next: currencyRate => {
        console.log('We got here ' + this.baseCurrency);
        this.currencyRate  = currencyRate;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = 'Cannot load data -' + err.message
      }
    });

  }

}

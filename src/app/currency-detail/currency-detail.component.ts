import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DataService } from '../data.service';
import { IHistoricalCurrencyRate } from '../Interfaces/ihistorical-currency-rate';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-currency-detail',
  templateUrl: './currency-detail.component.html',
  styleUrls: ['./currency-detail.component.css']
})
export class CurrencyDetailComponent implements OnInit {

  baseCurrency:string;
  baseDateStart:Date =new Date(2020,4,4);
  baseDateEnd:Date =new Date();
  historicalCurrencies: IHistoricalCurrencyRate[];
  allCurrencies:string[];
  loading:boolean=true;
  errorMessage:string;
  constructor(private route:ActivatedRoute, private _dataService:DataService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.baseCurrency = this.route.snapshot.paramMap.get('baseCurrencyName');
    if(this.baseCurrency == undefined || this.baseCurrency === '') this.baseCurrency = 'EUR';
    console.log('base currency name ' + this.baseCurrency)
    this.Reload();
  }

  ngOnDestroy(): void {
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
        this.errorMessage = 'Cannot load currencies, ' + err.Message
      }

    });

    this._dataService.GetHistoricalRates(this.datepipe.transform(this.baseDateStart, 'yyyy-MM-dd'), this.datepipe.transform(this.baseDateEnd, 'yyyy-MM-dd'), this.baseCurrency).subscribe({
      next:currencies=>{
        this.historicalCurrencies = currencies
        this.loading = false
      },
      error:err=>{
        this.errorMessage = 'Cannot load historical rates ' + err.Message
        this.loading = false;
      }
    })
  }

}

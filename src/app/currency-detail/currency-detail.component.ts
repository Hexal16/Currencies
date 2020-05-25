import { Component, OnInit, Input, DefaultIterableDiffer, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DataService } from '../data.service';
import { IHistoricalCurrencyRate } from '../Interfaces/ihistorical-currency-rate';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription, Subject } from 'rxjs';
import { IRate } from '../Interfaces/IRate';

@Component({
  selector: 'app-currency-detail',
  templateUrl: './currency-detail.component.html',
  styleUrls: ['./currency-detail.component.css']
})
export class CurrencyDetailComponent implements OnInit, OnDestroy {

  baseCurrency:string;
  // 1 week back, I really dont see a better way to get that,
  baseDateStart:Date = new Date(new Date().setDate(new Date().getDate() - 7)); 
  baseDateEnd:Date =new Date();
  historicalCurrencies: IHistoricalCurrencyRate[];
  fitleredHistoricalCurrencies: IHistoricalCurrencyRate[];

  allCurrencies:string[];
  loading:boolean=true;
  errorMessage:string;
  warningMessage: string;
  ratesSubscription : Subscription;

  maxDate:string = new Date().toJSON().split('T')[0];
  minDate:string = new Date(1999,4,1).toJSON().split('T')[0];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};
  constructor(private route:ActivatedRoute, private router:Router, private _dataService:DataService, public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.baseCurrency = this.route.snapshot.paramMap.get('baseCurrencyName');
    if(this.baseCurrency == undefined || this.baseCurrency === '') this.baseCurrency = 'EUR';
    this.loading = true;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll:true
    };
    this.Reload();
  }

  // When unloading this view, stop the big subscription, to save memory
  StopLoading()
  {
    this.fitleredHistoricalCurrencies = [];
    this.historicalCurrencies = [];
  }

  ngOnDestroy(): void {
   this.StopLoading();
  }

  // Loads or reloads currency rates
  Reload()
  {
    this.fitleredHistoricalCurrencies = [];
    this.historicalCurrencies = [];
    this.warningMessage = '';
    this.errorMessage = '';
    if(new Date(this.baseDateEnd).getTime() < new Date(this.baseDateStart).getTime())
    {
      this.errorMessage = 'Start date cannot be bigger than end date';
      return;
    }
    this.loading = true;
    if(this.DateDiffinDays(this.baseDateStart, this.baseDateEnd) > 365*2)
    {
      this.warningMessage = 'You just asked for historical data for more than 2 years, this is a warning that it might take a while depending on your machine. Have fun';
    }

    this._dataService.GetCurrencies().subscribe({
      next:currencies=>{
        this.allCurrencies =currencies;
        // At start add ALL curencies and make them selected
        this.dropdownList = [];
        this.allCurrencies.forEach((element, index) => {
          this.dropdownList.push({ item_id: index, item_text: element })
        });
        this.selectedItems = this.dropdownList;
      },
      error:err=>{
        this.errorMessage = 'Cannot load currencies, ' + err
      }
    });

    this.ratesSubscription = this._dataService.GetHistoricalRates(this.datepipe.transform(this.baseDateStart, 'yyyy-MM-dd'), this.datepipe.transform(this.baseDateEnd, 'yyyy-MM-dd'), this.baseCurrency)
    .subscribe({
      next:currencies=>{
        this.historicalCurrencies =  currencies.sort(a => a.date.getTime()).reverse();
        this.fitleredHistoricalCurrencies= currencies.sort((a, b) => (a.date.getTime() > b.date.getTime()) ? 1 : -1).reverse();
        this.loading = false
      },
      error:err=>{
        this.errorMessage = `Cannot load historical rates. Technical error message: ${err.message}`
        this.loading = false;
      }
    })
  }

  FilterResult()
  {
    console.log('Should be ' + this.selectedItems.length)
    this.fitleredHistoricalCurrencies= JSON.parse(JSON.stringify(this.historicalCurrencies));
    this.fitleredHistoricalCurrencies.forEach((rate:IHistoricalCurrencyRate) =>
      rate.rates = rate.rates.filter((r:IRate) => this.selectedItems.findIndex(si=>si['item_text'] === r.CurrencyName ) > -1 )
    )
  }

  // Makes sure url represents which currency is set as base
  NavigateToPage()
  {
    this.router.navigate(['/currency-detail/'+this.baseCurrency])
    this.Reload();
  }

  // Helper mehtod to calculte days bnetween 2 dates
  DateDiffinDays(startDate: Date, endDate:Date) : number
  {
    let diffInTime = (new Date(endDate).valueOf() -  new Date(startDate).valueOf());
    return  Math.ceil(diffInTime / (1000 * 3600 * 24));   
  }
}

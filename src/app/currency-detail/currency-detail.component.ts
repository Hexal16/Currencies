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
        this.fitleredHistoricalCurrencies= JSON.parse(JSON.stringify(this.historicalCurrencies));
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

  // Helper mehtod to 
  DateDiffinDays(startDate: Date, endDate:Date) : number
  {
    let diffInTime = (new Date(endDate).valueOf() -  new Date(startDate).valueOf());
    return  Math.ceil(diffInTime / (1000 * 3600 * 24));   
  }

  sortTable(n:number) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("currency_table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

}

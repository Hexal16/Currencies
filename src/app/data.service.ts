import { Injectable } from '@angular/core';
import { ICurrencyRate } from './Interfaces/ICurrency-rate';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { IRate } from './Interfaces/IRate';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  ApiUrl: string = 'https://api.exchangeratesapi.io/';
  constructor(private http: HttpClient) { }

  GetRates(currency:string = '', date:string = 'latest'): Observable<ICurrencyRate>
  {
    console.log('The date iiis ' + date)
    let latestRatesUrl: string=this.ApiUrl+date
    if(currency !== '')
    {
      latestRatesUrl += '?base='+currency
    }

    console.log('loading data for ' + latestRatesUrl);
    return this.http.get<any>(latestRatesUrl)
    .pipe(
      map(
        data => {
          return {
            rates:Object.entries(data.rates).map(element => {
              return {
                CurrencyName:element[0],
                Rate:data.rates[element[0]]
              }
            }),
            base:data.base,
            date:data.date
          }
        },
        error => console.log('Could not load data from latestRatesUrl, ' + error)
      )
    );
  }

  GetCurrencies():Observable<string[]>
  {
    let latestRatesUrl: string=this.ApiUrl+'latest';
    return this.http.get<any>(latestRatesUrl)
    .pipe(map((data) => {
        return Object.keys(data['rates'])
    }));

  }

}

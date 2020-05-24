import { Injectable } from '@angular/core';
import { ICurrencyRate } from './Interfaces/ICurrency-rate';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { IRate } from './Interfaces/IRate';
import { IHistoricalCurrencyRate } from './Interfaces/ihistorical-currency-rate';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  ApiUrl: string = 'https://api.exchangeratesapi.io/';
  constructor(private http: HttpClient) { }

  GetRates(currency:string = '', date:string = 'latest'): Observable<ICurrencyRate>
  {
    let latestRatesUrl: string=this.ApiUrl+date
    if(currency !== '')
    {
      latestRatesUrl += '?base='+currency
    }
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

  GetHistoricalRates(startDate:string, endDate:string, baseCurrency:string =''):Observable<IHistoricalCurrencyRate[]>
  {
    let historicalRatesUrl:string = `${this.ApiUrl}history?start_at=${startDate}&end_at=${endDate}`;
    if(baseCurrency !== '') historicalRatesUrl += `&base=${baseCurrency}`;
    console.log('calling api address ' + historicalRatesUrl);
    return this.http.get<any>(historicalRatesUrl)
    .pipe(
      map(
        data => {
          return Object.entries(data['rates']).map(rateElement => {
            return {
              date:new Date(rateElement[0]),
              rates:Object.entries(rateElement[1]).map(element => {
                return {
                  CurrencyName:element[0],
                  Rate:element[1]
                }
              })          
            }
        })
        },
        error => console.log('Sorry, all broke down ' + error)
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

import { Injectable } from '@angular/core';
import { ICurrencyRate } from './Interfaces/ICurrency-rate';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
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
        (error: { message: string; }) => {
          return console.log('GetRates() failed ' + error.message);
        }
      )
    );
  }

  GetHistoricalRates(startDate:string, endDate:string, baseCurrency:string =''):Observable<IHistoricalCurrencyRate[]>
  {
    let historicalRatesUrl:string = `${this.ApiUrl}history?start_at=${startDate}&end_at=${endDate}`;
    if(baseCurrency !== '') historicalRatesUrl += `&base=${baseCurrency}`;
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
        (error: { message: string; }) => {
          return console.log('GetHistoricalRates() ' + error.message);
        }
      )
    );
  }

  GetCurrencies():Observable<string[]>
  {
    let latestRatesUrl: string=this.ApiUrl+'latest';
    return this.http.get<any>(latestRatesUrl)
    .pipe(map((data) => {
        let allRates= Object.keys(data['rates']);
        // Idk why but EUR is always excluded. Other currencies are always shown. So I put back EUR
        if(allRates.indexOf('EUR') === -1)
        {
          allRates.push('EUR');
        }
        return allRates;
    }));
  }
}

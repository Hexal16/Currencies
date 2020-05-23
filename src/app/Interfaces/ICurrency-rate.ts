import { IRate } from './IRate';

export interface ICurrencyRate {
    rates:IRate[],
    base:string;
    date:Date
    
}

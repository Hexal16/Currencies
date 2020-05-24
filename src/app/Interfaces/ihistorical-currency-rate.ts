import { IRate } from './IRate';

export interface IHistoricalCurrencyRate {
    rates:IRate[],
    date:Date
}

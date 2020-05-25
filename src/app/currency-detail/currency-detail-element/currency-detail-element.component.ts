import { Component, OnInit, Input } from '@angular/core';
import { ICurrencyRate } from 'src/app/Interfaces/ICurrency-rate';

@Component({
  selector: 'app-currency-detail-element',
  templateUrl: './currency-detail-element.component.html',
  styleUrls: ['./currency-detail-element.component.css']
})
export class CurrencyDetailElementComponent implements OnInit {

  constructor() { }
  @Input() rate: ICurrencyRate
  ngOnInit() {
  }

}

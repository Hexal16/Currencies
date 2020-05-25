import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyDetailElementComponent } from './currency-detail-element.component';

describe('CurrencyDetailElementComponent', () => {
  let component: CurrencyDetailElementComponent;
  let fixture: ComponentFixture<CurrencyDetailElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyDetailElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyDetailElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

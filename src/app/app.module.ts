import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';
import { CurrencyDetailComponent } from './currency-detail/currency-detail.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyListComponent,
    CurrencyDetailComponent,
    NavMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, //TODO : use this
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: CurrencyListComponent, pathMatch: 'full' },
      { path: 'currency-detail/:baseCurrencyName', component: CurrencyDetailComponent, pathMatch: 'full' },
      { path: 'currency-detail/', component: CurrencyDetailComponent, pathMatch: 'full' },
    ])
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

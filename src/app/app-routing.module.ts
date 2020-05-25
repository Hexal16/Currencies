import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyListComponent } from './currency-list/currency-list.component';
import { CurrencyDetailComponent } from './currency-detail/currency-detail.component';

const routes: Routes = [
  { path: '', component: CurrencyListComponent, pathMatch: 'full', data:{preload:false} },
  { path: 'currency-detail/:baseCurrencyName', component: CurrencyDetailComponent, pathMatch: 'full' },
  { path: 'currency-detail/', component: CurrencyDetailComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
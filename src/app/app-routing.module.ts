import { Component, NgModule } from '@angular/core';
import { SecurePagesGuard } from './secure-pages.guard';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CountByCountryComponent } from './count-by-country/count-by-country.component';
import { SigninComponent } from './signin/signin.component';
import { WorldcountComponent } from './worldcount/worldcount.component';
import {WorldnewsComponent} from './worldnews/worldnews.component';

const routes: Routes = [
  {path: "signin", component: SigninComponent,canActivate: [SecurePagesGuard]},
  {path:"worldcount", component: WorldcountComponent,canActivate:[AuthGuard]},
  {path: "count-by-country",children:[{path: "**", component: CountByCountryComponent, canActivate: [AuthGuard]}]},
  {path: "worldnews",component: WorldnewsComponent, canActivate:[AuthGuard]},
  {path:"", pathMatch:"full", redirectTo:"signin",canActivate: [AuthGuard]},
  {path:"**", redirectTo:"signin"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }

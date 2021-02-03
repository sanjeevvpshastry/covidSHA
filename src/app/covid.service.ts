import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from './user_mod';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { News } from './news.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  description: string="";
  country_news = 'world';
  private user: User
  URL_basic = 'https://api.covid19api.com';
  sumsub = new Subject<number[]>();
  CountrySumSub = new Subject<{name: string, values:number[]}>();
  sum7daysSub = new Subject<number[][]>();
  sumFromSub = new Subject<number[][]>();
  countriesSub = new Subject<{name: string, values:number[]}[]>();
  countrySub = new Subject<string[]>();
  countries_Data: {name: string, values:number[]}[] = [];
  summary : number[]= [];
  summary7days : number[][]= [[],[],[]];
  summaryFrom : number[][]= [[],[],[],[]];
  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, private httpClient: HttpClient) { }

  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    this.user ={
      uid:credentials.user.uid,
      displayName: credentials.user.displayName,
      email: credentials.user.email
    };
    localStorage.setItem("user",JSON.stringify(this.user));
    this.update_UserData( );
    this.router.navigate(["worldcount"]);
  }
  private update_UserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    },{merge: true});
  }
  getUser(){
    if(this.user == null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user"))
    }
    return this.user;
  }
  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
  }
  public signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);
  }

  public get_data_Countries(){
    this.countries_Data = []
    this.httpClient
    .get<any[]>(this.URL_basic + '/summary')
      .subscribe(
        (response) => {
          for (const country of response["Countries"]){
            this.countries_Data.push({name: country["Country"], values:[country["NewConfirmed"],country["TotalConfirmed"],country["NewRecovered"],country["TotalRecovered"],country["NewDeaths"],country["TotalDeaths"],country["Slug"]]});
          }
          this.countriesSub.next(this.countries_Data);
        },
        (error: any) => {
          console.log(error);
          return;
        }
    );
  }
  public get_total_Summary(country='all'){
    this.summary = [];
    console.log(country)
    this.httpClient
      .get<any[]>(this.URL_basic + '/summary')
      .subscribe(
        (response) => {
          this.summary[0]=response["Global"]["TotalConfirmed"];
          this.summary[1]=response["Global"]["NewConfirmed"];
          this.summary[3]=response["Global"]["TotalRecovered"];
          this.summary[4]=response["Global"]["NewRecovered"];
          this.summary[5]=this.summary[3]/this.summary[0];
          this.summary[6]=response["Global"]["TotalDeaths"];
          this.summary[7]=response["Global"]["NewDeaths"];
          this.summary[8]=this.summary[6]/this.summary[0];
          this.summary[2]=this.summary[0]-this.summary[3];
          this.sumsub.next(this.summary);
          return;
        },
        (error: any) => {
          console.log(error);
          return;
        }
    );
  }
  public get_total_SummaryCountry(country='all'){
    this.summary = [];
    console.log(country)
    this.httpClient
      .get<any[]>(this.URL_basic + '/summary')
      .subscribe(
        (response) => {
          for (const d of response["Countries"]){
            if(d["Slug"] == country){
              this.summary[0]=d["TotalConfirmed"];
              this.summary[1]=d["NewConfirmed"];
              this.summary[3]=d["TotalRecovered"];
              this.summary[4]=d["NewRecovered"];
              this.summary[5]=this.summary[3]/this.summary[0];
              this.summary[6]=d["TotalDeaths"];
              this.summary[7]=d["NewDeaths"];
              this.summary[8]=this.summary[6]/this.summary[0];
              this.summary[2]=this.summary[0]-this.summary[3];
              console.log(this.summary);
              this.CountrySumSub.next({name:country, values: this.summary});
              return;
            }
          }
        },
        (error: any) => {
          console.log(error);
          return;
        }
    );
  }
  sort_by_key_name(array, key)
  {
  return array.sort(function(a, b)
  {
    var x = a[key]; var y = b[key];
    return ((x < y) ) ? -1 : (((x > y) ? 1 : 0));
  });
  }
  public get_total_Summary7days(day1,day7, countrySlug='all'){
  
    this.summary7days = [[],[],[]];
    if(countrySlug=='all'){
    this.httpClient
      .get<any[]>(this.URL_basic + '/world?from=' + day1 + '&to=' + day7)
      .subscribe(
        (response) => {
          if(response!=null){
          this.sort_by_key_name(response,"TotalConfirmed");
          for (const d of response){
            this.summary7days[0].push(d["NewDeaths"]);
            this.summary7days[1].push(d["NewRecovered"]);
            this.summary7days[2].push(d["NewConfirmed"]);
          }
          this.sum7daysSub.next(this.summary7days);
          return;
        }
        },
        (error: any) => {
          console.log(error);
          return;
        }
    );
      }
      else{
        this.httpClient
      .get<any[]>(this.URL_basic + '/total/dayone/country/'+countrySlug+'?from=' + day1 + '&to=' + day7)
      .subscribe(
        (response) => {
          console.log(this.URL_basic + '/total/dayone/country/'+countrySlug+'?from=' + day1 + '&to=' + day7)
          this.sort_by_key_name(response,"Date");
          var i=0;var a;
          for (const d of response){
              if(i!=0){
                this.summary7days[0].push(d["Deaths"] -a["Deaths"]);
                this.summary7days[1].push(d["Recovered"] - a["Recovered"]);
                this.summary7days[2].push(d["Confirmed"] - a["Confirmed"]);
              }
              a = d
              if(i==0){i=i+1; continue;}
          }
          this.sum7daysSub.next(this.summary7days);
        },
        (error: any) => {
          console.log(error);
          return;
        }
    );
      }
  }
  public get_Country(countrySlug: string){
    this.httpClient
      .get<any[]>(this.URL_basic + '/countries')
      .subscribe(
        (response) => {
          console.log(response)
          for (const d of response){
            if(d["Slug"] == countrySlug){
              this.countrySub.next([d["Country"],d["ISO2"]]);
              return;
            }
          }
          this.router.navigate(["worldcount"]);
          return;
        },
        (error: any) => {
          console.log(error);
          return;
        }
    );
  }
  public get_total_SummaryFrom(countrySlug='all', day1 = '2020-04-13'){
    this.summaryFrom[0]=[];this.summaryFrom[1]=[];this.summaryFrom[2]=[];this.summaryFrom[3]=[];
    var today = (new Date()).toISOString().slice(0,10)
    if(countrySlug == 'all'){
      this.httpClient
        .get<any[]>(this.URL_basic + '/world?from=' + day1 + '&to=' + today)
        .subscribe(
          (response) => {
            this.sort_by_key_name(response,"TotalConfirmed");
            for (const d of response){
              this.summaryFrom[0].push(d["TotalDeaths"]);
              this.summaryFrom[1].push(d["TotalRecovered"]);
              this.summaryFrom[2].push(d["TotalConfirmed"]);
            }
            this.sumFromSub.next(this.summaryFrom);
            return;
          },
          (error: any) => {
            console.log(error);
            return;
          }
      );}
    else{
      this.httpClient
      .get<any[]>(this.URL_basic + '/total/dayone/country/'+countrySlug+'?from=' + day1 + '&to=' + today)
      .subscribe(
        (response) => {
          this.sort_by_key_name(response,"TotalConfirmed");
          for (const d of response){
            this.summaryFrom[0].push(d["Deaths"]);
            this.summaryFrom[1].push(d["Recovered"]);
            this.summaryFrom[2].push(d["Confirmed"]);
            this.summaryFrom[3].push(d["Date"]);
          }
          this.sumFromSub.next(this.summaryFrom);
        },
        (error: any) => {
          console.log(error);
          return;
        }
      );
    }
  }

}

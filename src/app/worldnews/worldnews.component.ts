import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CovidService } from './../covid.service';
import { News } from './../news.model';
import { User } from './../user_mod';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Summary } from './../summary.model';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
@Component({
  selector: 'app-worldnews',
  templateUrl: './worldnews.component.html',
  styleUrls: ['./worldnews.component.css']
})
export class WorldnewsComponent implements OnInit {
  description: string="";
  user: User;
  country_news = 'world';
  constructor(public covidservice:CovidService, private router: Router, private firestore: AngularFirestore) { 
    
    
  }

  ngOnInit(): void {
    this.user = this.covidservice.getUser();
 
  }
  public addNews(){
    let news: News = {
      date: new Date(),
      description: this .description,
      username: this.user.displayName,
      uid:this.user.uid,
      country: this.country_news
    };
    this.firestore.collection("news").doc("news").collection(this.country_news).add(news);
    this.description ="";
  }
  changeNewsCountry(country){
    this.country_news = country;
    }
}

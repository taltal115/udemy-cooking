import {Component, OnDestroy, OnInit} from '@angular/core';

import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import {Observer} from "rxjs/Observer";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  numbersObservableSubscription: Subscription;
  customObservableSubscription: Subscription;
  constructor() { }

  ngOnInit() {
    const myNumbers = Observable.interval(1000);
    this.numbersObservableSubscription = myNumbers.subscribe(
      (number: number) =>{
        console.log(number);
      }
    )

    const myObservable = Observable.create((observer: Observer<string>) => {
      setTimeout(() => {
        observer.next('first package');
      }, 2000);
      setTimeout(() => {
        observer.next('second package');
      }, 4000);
      setTimeout(() => {
        // observer.error('this dose not work');
        observer.complete()
      }, 5000)
    });

    this.customObservableSubscription = myObservable.subscribe(
      (data: string) => {console.log(data);},
      (error: string) => {console.error(error)},
      () => {console.log('completed')}
    )
  }

  ngOnDestroy() {
    this.numbersObservableSubscription.unsubscribe();
    this.customObservableSubscription.unsubscribe()
  }
}

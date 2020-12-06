import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../services/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { Income } from '../interfaces/income';
import { Bill } from '../interfaces/bill';
import { Category } from '../interfaces/category';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.page.html',
  styleUrls: ['./budget.page.scss'],
})
export class BudgetPage implements OnInit {

  public uid: string|null;

  //variables for budget breakdown
  public margin:number = 0;
  public cash:number = 0;

  //variables for incomes things
  incomes$: Observable<Income[]>|any;
  public incomesArray:Array<any>;

  public startAmount:number = 0;
  public incomesTotal:number = 0;
  public otherIncomesTotal:number = 0;


  //variables for bills things
  bills$: Observable<Bill[]> | any;
  public billsArray:Array<any>;

  public billsTotal:number = 0;

  //variables for spending things
  categories$: Observable<Category[]> | any;
  public spendingArray:Array<any>;

  public spendingTotal:number = 0;


  constructor(
    private fireService: FirebaseService,
    private firestore: AngularFirestore
  ) {
    this.getUser()

    //get reference to this user's incomes
    this.incomes$ = this.firestore.collection('incomes', ref => ref.where('uid', '==',  this.uid)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as Income;
             const id = a.payload.doc.id;
             return { id, ...data };
           }))
          );

    //get reference to this user's bills
    this.bills$ = this.firestore.collection('bills', ref => ref.orderBy('dueDate', 'asc').where('uid', '==',  this.uid)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as Bill;
             const id = a.payload.doc.id;
             return { id, ...data };
           }))
          );

    //get reference to this user's bills
    this.categories$ = this.firestore.collection('categories', ref => ref.where('uid', '==',  this.uid)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as Category;
             const id = a.payload.doc.id;
             return { id, ...data };
           }))
          );
  }

  ngOnInit() {
    this.gatherIncomesStuff();
    this.gatherBillsStuff();
    this.gatherSpendingStuff();
  }

  ionViewDidEnter() {
    this.calculateBudget();
  }

  getUser():void {
    //get user id from fireservice
    this.uid = this.fireService.getUserId();
  }

  calculateBudget():void {
    let margin = 0;
    margin += this.incomesTotal;
    margin -= this.billsTotal;
    margin -= this.spendingTotal;
    this.margin = margin;
  }

  gatherIncomesStuff() {
    this.startAmount = this.fireService.startAmount;
    this.otherIncomesTotal = this.fireService.otherIncomesTotal;
    console.log(this.startAmount,this.otherIncomesTotal);

    this.incomes$.subscribe((snap)=>{
      this.incomesArray = [];
      snap.forEach((doc)=> {
        this.incomesArray.push(doc);
      })
      console.log(this.incomesArray);
      this.calculateIncomesTotal()
    });
  }

  gatherBillsStuff() {
    this.bills$.subscribe((snap)=>{
      this.billsArray = [];
      snap.forEach((doc)=> {
        if(doc.isChecked) {
          this.billsArray.push(doc);
        }
      })
      console.log(this.billsArray);
      this.calculateBillsTotal()
    });
  }

  gatherSpendingStuff() {
    // subscribe to observable categories array
    this.categories$.subscribe((snap)=>{
      this.spendingArray = [];
      snap.forEach((doc)=> {
        this.spendingArray.push(doc);
      })
      // console.log(this.values);
      this.calculateSpendingTotal();
    });
  }

  calculateIncomesTotal():void {
    let incomesTotal = 0;
    incomesTotal += this.startAmount;
    incomesTotal += this.otherIncomesTotal;
    this.incomesArray.forEach((income)=>{
      incomesTotal += income.amount;
    })
    console.log(incomesTotal);
    this.incomesTotal = incomesTotal;
  }

  calculateBillsTotal():void {
    let billsTotal = 0;
    this.billsArray.forEach((bill)=>{
      if (bill.isChecked) {
        billsTotal += bill.amount;
      }
    })
    console.log(billsTotal);
    this.billsTotal = billsTotal;
  }

  calculateSpendingTotal():void {
    let spendingTotal = 0;
    this.cash = 0;
    
    this.spendingArray.forEach((category)=>{
      spendingTotal += category.amount;
      if(category.isChecked) {
        this.cash += category.amount;
      }
    })
    console.log(spendingTotal);
    this.spendingTotal = spendingTotal;
  }

}

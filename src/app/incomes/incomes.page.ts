import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../services/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { Income } from '../interfaces/income';

import { AlertController } from '@ionic/angular';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.page.html',
  styleUrls: ['./incomes.page.scss'],
})
export class IncomesPage implements OnInit {

  public uid: string|null;
  incomes$: Observable<Income[]> | any;
  incomesDoc: Observable<Income[]> | any;

  public values:any = [];

  public startAmount:number = 0;
  public otherIncomesTotal:number = 0;

  public showCardContent:boolean = true;

  constructor(
    public alertController:AlertController,
    public fireService: FirebaseService,
    public firestore: AngularFirestore
  ) { 
    this.getUser()

    //get reference to this user's incomes (NO EDIT / DELETE)
    this.incomes$ = this.firestore.collection('incomes', ref => ref.where('uid', '==',  this.uid)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as Income;
             const id = a.payload.doc.id;
             return { id, ...data };
           }))
          );

    //get reference to ALL incomes (CAN EDIT / DELETE)
    this.incomesDoc = this.firestore.collection('incomes').valueChanges();
  }

  ngOnInit() {
    //set the two static fields if available
    if(this.fireService.startAmount) {
      this.startAmount = this.fireService.startAmount;
    }
    if(this.fireService.otherIncomesTotal) {
      this.otherIncomesTotal = this.fireService.otherIncomesTotal;
    }

    // subscribe to observable incomes array
    this.incomes$.subscribe((snap)=>{
      this.values = [];
      snap.forEach((doc)=> {
        this.values.push(doc);
      })
      console.log(this.values);
    });    
  }

  //store the data before leaving the page
  ionViewWillLeave() {
    //set the two static amount in fireService
    this.fireService.startAmount = this.startAmount;
    this.fireService.otherIncomesTotal = this.otherIncomesTotal;

    this.values.forEach((income) => {
      //set the new amount in firestore
      this.firestore
      .collection('incomes')
      .doc(income.id)
      .update({amount: income.amount})
      .then(()=>{console.log('yup')});
    })
  }

  showHideCardContent() {
    this.showCardContent = !this.showCardContent;
  }

  getUser():void {
    //get user id from fireservice
    this.uid = this.fireService.getUserId();
  }

  async editIncome(incomeId, incomeData) {
    // display the alert with inputs
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Edit Income',
      inputs: [
        {
          name: 'incomeName',
          type: 'text',
          placeholder: 'Income Name',
          value: incomeData.name
        },
        {
          name: 'incomeAmount',
          placeholder: 'Income Amount',
          type: 'number',
          attributes: {
            inputMode:'decimal'
          },
          min: 0,
          value: incomeData.amount
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            //create Income object
            let newIncome:Income = {
              uid: this.uid,
              name: alertData.incomeName,
              amount: Number(alertData.incomeAmount)
            }
            //update firestore doc with the new Income object
            this.firestore.collection('incomes').doc(incomeId).update(newIncome);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteIncome(incomeId, incomeData) {
    //pop up alert to delete income
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Delete Income',
      message: 'Are you sure you want to delete <strong>' + incomeData.name + '</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          role: 'delete',
          handler: (alertData) => {
            console.log('Confirm Delete');
            //remove the income doc from firestore
            this.firestore.doc<Income>('incomes/'+incomeId).delete();
          }
        }
      ]
    });
    await alert.present();
  }

  async addIncome() {
    // display the alert with inputs
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'New Income',
      inputs: [
        {
          name: 'incomeName',
          type: 'text',
          placeholder: 'Income Name'
        },
        {
          name: 'incomeAmount',
          placeholder: 'Income Amount',
          type: 'number',
          attributes: {
            inputMode:'decimal'
          },
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            //create new Income object
            let newIncome:Income = {
              uid: this.uid,
              name: alertData.incomeName,
              amount: Number(alertData.incomeAmount)
            }
            //add Income object to firestore as new doc
            this.firestore.collection('incomes').add(newIncome);

            
          }
        }
      ]
    });
    await alert.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Bill } from '../interfaces/bill';

import { AlertController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})
export class BillsPage implements OnInit {

  public uid: string|null;
  bills$: Observable<Bill[]> | any;
  billsDoc: Observable<Bill[]> | any;

  public values:any = [];

  public showCardContent:boolean = true;

  constructor(
    public alertController:AlertController,
    public fireService: FirebaseService,
    public firestore: AngularFirestore
  ) { 
    this.getUser()

    //get reference to this user's bills (NO EDIT / DELETE)
    this.bills$ = this.firestore.collection('bills', ref => ref.orderBy('dueDate', 'asc').where('uid', '==',  this.uid)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as Bill;
             const id = a.payload.doc.id;
             return { id, ...data };
           }))
          );

    //get reference to ALL bills (CAN EDIT / DELETE)
    this.billsDoc = this.firestore.collection('bills').valueChanges();
  }

  ngOnInit() {
    // subscribe to observable bills array
    this.bills$.subscribe((snap)=>{
      this.values = [];
      snap.forEach((doc)=> {
        this.values.push(doc);
      })
      // console.log(this.values);
    });
  }

  //store the data before leaving the page
  ionViewWillLeave() {
    this.values.forEach((bill) => {
      //update all bills in firestore
      this.firestore
      .collection('bills')
      .doc(bill.id)
      .update({isChecked: bill.isChecked})
      // .then(()=>{console.log('yup')});
    })
  }

  showHideCardContent() {
    this.showCardContent = !this.showCardContent;
  }

  getUser():void {
    //get user id from fireservice
    this.uid = this.fireService.getUserId();
    // console.log(this.uid);
  }


  async editBill(billId, billData) {
    // console.log(billId);
    //pop up alert to edit
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Edit Bill',
      inputs: [
        {
          name: 'billName',
          type: 'text',
          id: 'billName',
          placeholder: 'Bill Name',
          label: 'Bill Name:',
          value: billData.name
        },
        {
          name: 'billDueDate',
          id: 'billDueDate',
          placeholder: 'Due Date',
          label: 'Due Date:',
          type: 'number',
          min: 0,
          max: 31,
          value: billData.dueDate
        },
        {
          name: 'billAmount',
          id: 'billAmount',
          placeholder: 'Amount Due',
          label: 'Amount:',
          type: 'number',
          min: 0,
          value: billData.amount
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
          text: 'Submit',
          handler: (alertData) => {
            let newBill:Bill = {
              name: alertData.billName,
              amount: Number(alertData.billAmount),
              dueDate: Number(alertData.billDueDate)
            }
            this.firestore.collection('bills').doc(billId).update(newBill);
          }
        }
      ]
    });
    await alert.present();
  }


  async deleteBill(billId, billData) {
    //pop up alert to delete
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Delete Bill',
      message: 'Are you sure you want to delete <strong>' + billData.name + '</strong>?',
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
            //remove the bill from firestore
            this.firestore.doc<Bill>('bills/'+billId).delete();
          }
        }
      ]
    });
    await alert.present();
  }


  async addBill() {
    // console.log('Confirm Add Bill');
    //pop up alert to add new bill
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'New Bill',
      inputs: [
        {
          name: 'billName',
          type: 'text',
          // id: 'billName',
          placeholder: 'Bill Name',
          // label: 'Bill Name:',
        },
        {
          name: 'billDueDate',
          // id: 'billDueDate',
          placeholder: 'Due Date',
          // label: 'Due Date:',
          type: 'number',
          min: 0,
          max: 31,
        },
        {
          name: 'billAmount',
          // id: 'billAmount',
          placeholder: 'Amount Due',
          // label: 'Amount:',
          type: 'number',
          min: 0,
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
          text: 'Submit',
          handler: (alertData) => {
            let newBill:Bill = {
              uid: this.uid,
              name: alertData.billName,
              amount: Number(alertData.billAmount),
              dueDate: Number(alertData.billDueDate),
              isChecked: false,
            }
            console.log('Confirm Submit | Add Bill');
            this.firestore.collection('bills').add(newBill);
          }
        }
      ]
    });
    await alert.present();
  }
}

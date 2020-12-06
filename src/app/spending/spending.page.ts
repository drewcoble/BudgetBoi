import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Category } from '../interfaces/category';

import { AlertController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.page.html',
  styleUrls: ['./spending.page.scss'],
})
export class SpendingPage implements OnInit {

  public uid: string|null;
  categories$: Observable<Category[]> | any;
  categoriesDoc: Observable<Category[]> | any;

  public values:any = [];

  public showCardContent:boolean = true;

  constructor(
    public alertController:AlertController,
    public fireService: FirebaseService,
    public firestore: AngularFirestore
  ) { 
    this.getUser()

    //get reference to this user's bills (NO EDIT / DELETE)
    this.categories$ = this.firestore.collection('categories', ref => ref.where('uid', '==',  this.uid)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as Category;
             const id = a.payload.doc.id;
             return { id, ...data };
           }))
          );

    //get reference to ALL bills (CAN EDIT / DELETE)
    this.categoriesDoc = this.firestore.collection('categories').valueChanges();
  }

  ngOnInit() {
    // subscribe to observable categories array
    this.categories$.subscribe((snap)=>{
      this.values = [];
      snap.forEach((doc)=> {
        this.values.push(doc);
      })
      // console.log(this.values);
    });
  }

  //store the data before leaving the page
  ionViewWillLeave() {
    this.values.forEach((category) => {
      //update all categories in firestore
      this.firestore
      .collection('categories')
      .doc(category.id)
      .update(
        {
          isChecked: category.isChecked,
          amount: category.amount
        }
        )
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

  async editCategory(categoryId, categoryData) {
    // console.log(billId);
    //pop up alert to edit
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Edit Spending Category',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Category Name',
          value: categoryData.name
        },
        {
          name: 'categoryAmount',
          placeholder: 'Amount',
          type: 'number',
          min: 0,
          value: categoryData.amount
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
            let newCategory:Category = {
              uid: this.uid,
              name: alertData.categoryName,
              amount: Number(alertData.categoryAmount),
              isChecked: false,
            }
            console.log('Confirm Submit | Edit Category');
            this.firestore.collection('categories').doc(categoryId).update(newCategory);
          }
        }
      ]
    });

    await alert.present();
  }


  async deleteCategory(categoryId, categoryData) {
    //pop up alert to delete
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Delete Spending Category',
      message: 'Are you sure you want to delete <strong>' + categoryData.name + '</strong>?',
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
            //remove the category from firestore
            this.firestore.doc<Category>('categories/'+categoryId).delete();
          }
        }
      ]
    });

    await alert.present();
  }


  async addCategory() {
    //pop up alert to add new spending category
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'New Spending Category',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Category Name',
        },
        {
          name: 'categoryAmount',
          placeholder: 'Amount',
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
            let newCategory:Category = {
              uid: this.uid,
              name: alertData.categoryName,
              amount: Number(alertData.categoryAmount),
              isChecked: false
            }
            console.log('Confirm Submit | Add Category');
            this.firestore.collection('categories').add(newCategory);
          }
        }
      ]
    });

    await alert.present();
  }

  clickCategory(categoryId) {
    
  }

}

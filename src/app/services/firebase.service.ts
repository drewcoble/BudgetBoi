import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { User } from '../interfaces/user';
import { Income } from '../interfaces/income';
import { Bill } from '../interfaces/bill';
import { Category } from '../interfaces/category';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  public user: User|null;
  public isUser = false;
  public uid: string|null;

  public startAmount:number = 0;
  public otherIncomesTotal:number = 0;

  // public incomesData:Income[]|any;
  // public billsData:Bill[]|any;
  // public categoriesData:Category[]|any;

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
  ) {
    // watch for user changes
    this.fireAuth.onAuthStateChanged((user)=>{
      if (user) {
        //store the user id
        this.uid = user.uid;
        //get the user data from firestore
        this.getUserData(user.uid);
      }
      else {
        this.isUser = false;
        this.user = null;
      }
    });
  }

  getUserData(uid):any {
    this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .subscribe((doc)=>{
        
        let userData = doc.data();
        this.user = {
          uid: doc.id,
          fName: userData.fName,
          lName: userData.lName,
          email: userData.email,
          bills: userData.bills,
          incomes: userData.incomes,
          categories: userData.categories
        }
        
        this.isUser = true;
      })
  }

  getUserId():string|null {
    if (this.uid) {
      return this.uid;
    }
    else {
      return null;
    }
  }

/*****  methods for user registration, sign in, sign out  *****/
/**                                                          **/
/**                                                          **/
  signIn(email,password) {
    this.fireAuth.signInWithEmailAndPassword(email,password)
      .then((userCred) => {
      });
  }

  signOut() {
    this.fireAuth.signOut().then(() => {
    });
  }

  createNewUser(email, password, fName, lName) {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((res: any) => {
        //update the new user with the name data
        res.user.updateProfile({
          displayName: fName + " " + lName
        });
        this.addUserToFirestore(res.user.uid,fName,lName,email)
      })
      .catch((error: any) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  addUserToFirestore(uid, fName, lName, email) {

    let newUser = {
      fName: fName,
      lName: lName,
      email: email,
    }

    this.firestore
      .collection("users")
      .doc(uid)
      .set(newUser)
      .then(() => {
        // do something??
      });

  }
/**                                                          **/
/**                                                          **/
/*****       end of registration, sign in, sign out       *****/


}

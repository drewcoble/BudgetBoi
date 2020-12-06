import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public alertController:AlertController,
    public fireService: FirebaseService
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  async signIn() {
    //show the sign in alert
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Sign In',
      inputs: [
        {
          name: 'userEmail',
          type: 'email',
          id: 'userEmail',
          placeholder: 'Email'
        },
        {
          name: 'userPassword',
          id: 'userPassword',
          placeholder: 'Password',
          type: 'password'
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
          text: 'Sign In',
          handler: (alertData) => {

            let email = alertData.userEmail;
            let password = alertData.userPassword;
            this.fireService.signIn(email, password);

            console.log('Confirm Sign In');
          }
        }
      ]
    });

    await alert.present();
  }

  signOut():void {
    this.fireService.signOut();
  }

  async register() {
  //show the register alert 
  const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'New User Registration',
      inputs: [
        {
          name: 'firstName',
          type: 'text',
          id: 'firstName',
          placeholder: 'First Name'
        },
        {
          name: 'lastName',
          type: 'text',
          id: 'lastName',
          placeholder: 'Last Name'
        },
        {
          name: 'userEmail',
          type: 'email',
          id: 'userEmail',
          placeholder: 'Email'
        },
        {
          name: 'userPassword',
          id: 'userPassword',
          placeholder: 'Password',
          type: 'password'
        },
        {
          name: 'userPasswordMatch',
          id: 'userPasswordMatch',
          placeholder: 'Confirm Password',
          type: 'password'
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
          text: 'Create Account',
          handler: (alertData) => {
            if (alertData.userPassword == alertData.userPasswordMatch) {
              
              console.log('Confirm Create Account');
              this.fireService.createNewUser(alertData.userEmail, alertData.userPassword, alertData.firstName, alertData.lastName,);
            }
            else {
              console.log('Passwords do not match');
            }
          }
        }
      ]
    });

    await alert.present();
    // this.authService.createNewUser(email,password);
  }
}

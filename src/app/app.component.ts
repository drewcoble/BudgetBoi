import { Component } from '@angular/core';

import {Plugins} from '@capacitor/core'
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public incomes: Array<any>;
  public bills: Array<any>;
  public categories: Array<any>;

  constructor(
    
  ) {
    StatusBar.hide().catch((error)=> {
      console.warn(error);
    });
    SplashScreen.hide().catch((error)=> {
      console.warn(error);
    });
  }
}

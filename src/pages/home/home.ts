import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

// insert your own Product IDs
const MONTHLYLVL_KEY = 'com.devdactic.crossingnumbers.monthlylevels';
const CRYSTALS_KEY = 'com.devdactic.crossingnumbers.100crystal';
const GAMEMODE_KEY = 'com.devdactic.crossingnumbers.specialgamemode';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  products = [];
  previousPurchases = [];
  crystalCount = 0;
  specialGame = false;
  monthlySub = false;

  constructor(public navCtrl: NavController, private iap: InAppPurchase, private plt: Platform) {
    this.plt.ready().then(() => {
      this.iap.getProducts([MONTHLYLVL_KEY, CRYSTALS_KEY, GAMEMODE_KEY])
      .then((products) => {
        this.products = products;
      })
      .catch((err) => {
        console.log(err);
      });
    })

  }

  buy(product) {
    this.iap.buy(product).then(data => {
      this.enableItems(product);
    });
  }

  restore() {
    this.iap.restorePurchases().then(purchases => {
      this.previousPurchases = purchases;
      // unlock the features of the purchases
      for (let prev of this.previousPurchases) {
        this.enableItems(prev.productId);
      }
    });
  }

  enableItems(id) {
    // normally store these settings/purchases inside your app or server
    if (id === CRYSTALS_KEY) {
      this.crystalCount += 100;
    } else if (id === GAMEMODE_KEY) {
      this.specialGame = true;
    } else if (id === MONTHLYLVL_KEY) {
      this.monthlySub = true;
    }
  }

}

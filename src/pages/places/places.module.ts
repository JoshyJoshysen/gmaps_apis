import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacesPage } from './places';
import {AgmCoreModule} from "@agm/core";

@NgModule({
  declarations: [
    PlacesPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacesPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBeSPk_JRJdkteFrzpkOx0otjgGtVELQQY',
      libraries: ["places"]
    })
  ],
})
export class PlacesPageModule {}

import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { } from '@types/googlemaps';
import { MapsAPILoader } from '@agm/core';

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {
  @ViewChild('search') public searchElement: ElementRef;
  lat: number = 51.678418;
  lng: number = 7.809007;
  searchString: string;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  
  }
  
  ionViewWillEnter(){
    console.log(this.searchElement.nativeElement);
    this.mapsAPILoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });
      
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if(place.geometry === undefined || place.geometry === null ){
              return;
            }
          });
        });
      }
    );
  }

}

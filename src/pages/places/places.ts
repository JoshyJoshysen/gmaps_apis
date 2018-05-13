import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { } from '@types/googlemaps';
import { MapsAPILoader } from '@agm/core';
import PlaceSearchRequest = google.maps.places.PlaceSearchRequest;
import LatLng = google.maps.LatLng;

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {
  @ViewChild('search', { read: ElementRef })
  public searchElement: ElementRef;
  
  map: any;
  
  mapsettings = {
    lat: 51.678418,
    lng: 7.809007,
    zoom: 14
  };
  markers = [];
  
  searchString: string;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  
  }
  
  mapReady(event){
    this.map = event;
  }
  
  ionViewWillEnter(){
    this.mapsAPILoader.load().then(
      () => {
        if (navigator && navigator.geolocation){
          navigator.geolocation.getCurrentPosition((position) => {
            this.mapsettings.lat = position.coords.latitude;
            this.mapsettings.lng = position.coords.longitude;
            const loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.doSearch(loc);
          });
        } else {
          console.error("geolocation not supported");
        }
        
        const inputElement = this.searchElement.nativeElement.getElementsByTagName('input')[0];
        let autocomplete = new google.maps.places.Autocomplete(inputElement, { types:["address"] });
      
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if(place.geometry === undefined || place.geometry === null ){
              return;
            } else {
              let location = place.geometry.location;
              this.doSearch(location);
            }
          });
        });
      }
    );
  }
  
  doSearch(loc: LatLng){
  
    let request: PlaceSearchRequest = {
      location: loc,
      radius: 500,
      types: ['restaurant']
    };
    
    let service = new google.maps.places.PlacesService(this.map);
  
    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          let place = results[i];
          console.log(results[i]);
          let m = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.markers.push(m);
          console.log(this.markers);
        }
      }
    });
  }
}

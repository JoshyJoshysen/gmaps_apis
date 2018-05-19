import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-directions',
  templateUrl: 'directions.html',
})
export class DirectionsPage {
  @ViewChild('map') mapRef: ElementRef;
  map: google.maps.Map;
  nearbyLocations = [];

  constructor() {
  
  }
  
  ionViewWillEnter(){
  
  }
  
  findNearbyLocations(){
    navigator.geolocation.getCurrentPosition(position => {
      const mapCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.initMap(mapCenter);
      this.doNearbySearch(mapCenter);
    });
  }
  
  initMap(centerCoordinates: google.maps.LatLng){
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      zoom: 15,
      center: centerCoordinates
    });
  }
  
  private doNearbySearch(coords: google.maps.LatLng){
    const request: google.maps.places.PlaceSearchRequest = {
      location: coords,
      radius: 500,
      types: []
    };
    
    let service = new google.maps.places.PlacesService(this.map);
    
    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          console.log(place);
          //place a marker on the location of
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            animation: google.maps.Animation.DROP,
            title: place.name
          });
          
          marker.addListener('click', () => {
            //do direction calculation
            this.calculateDirection(coords, place.geometry.location)
          });
        });
      }
    });
  }
  
  private calculateDirection(origin: google.maps.LatLng, destination: google.maps.LatLng){
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode['WALKING']
    };
    directionsService.route(request, (response, status) => {
      if (status == 'OK') {
        console.log("directionsService response", response);
        directionsDisplay.setDirections(response);
      }
    });
  
  }
}

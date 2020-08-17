import { Component, OnInit } from "@angular/core";
import Echo from "laravel-echo";
import { EnvironmentService } from "src/app/services/env/environment.service";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth/auth.service";
import { TokenService } from "src/app/services/auth/token.service";
import { NavService } from "src/app/services/general/nav.service";

declare let google: any;

const PUSHER_API_KEY = environment.PUSHER_API_KEY;
const PUSHER_CLUSTER = environment.PUSHER_CLUSTER;

@Component({
  selector: "app-track-collector",
  templateUrl: "./track-collector.component.html",
  styleUrls: ["./track-collector.component.css"],
})
export class TrackCollectorComponent implements OnInit {
  constructor(
    private env: EnvironmentService,
    private Auth: AuthService,
    private token: TokenService,
    private nav: NavService
  ) {}

  data: any;
  map: any;
  lat: number = 6.651298;
  long: number = 3.299954;
  id: string;
  marker: any;
  markers = [];
  collID;
  collLocation;
  lineCoordinates = [];
  loading: boolean;
  displayedCollector: any = {};
  displayedCollectorRequests = [];

  ngOnInit(): void {
    this.subscribeToEcho();
    this.launchMap(this.lat, this.long);
  }

  subscribeToEcho() {
    let echo = new Echo({
      broadcaster: "pusher",
      key: PUSHER_API_KEY,
      cluster: PUSHER_CLUSTER,
    });
    echo.channel("location").listen("SendLocation", (e) => {
      this.data = e.location;
      this.updateMap(this.data);
    });
  }

  launchMap(lat, lng) {
    let nigeria = { lat: lat, lng: lng };
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: nigeria,
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("loc-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener("bounds_changed", () => {
      // @ts-ignore
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    // @ts-ignore
    let markers: google.maps.Marker[] = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map: this.map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
    // this.lineCoordinates.push(new google.maps.LatLng(this.lat, this.long));
  }

  updateMap(data) {
    this.lat = parseFloat(data.lat);
    this.long = parseFloat(data.long);
    this.id = data.id;
    var exists = false;
    for (let mark of this.markers) {
      if (mark.id == data.id) {
        exists = true;
        mark.marker.setPosition({
          lat: data.lat,
          lng: data.long,
          alt: 0,
        });
      }
    }

    if (!exists) {
      var marker = new google.maps.Marker({
        map: this.map,
        animation: "bounce",
        icon: "assets/images/icons/loc-marker.png",
      });

      const infowindow = new google.maps.InfoWindow({
        content: "<div>Collector " + data.id + "</div>",
      });
      marker.addListener("click", () => {
        infowindow.open(this.map, marker);
      });
      var m = {
        id: data.id,
        marker: marker,
      };

      this.markers.push(m);
      // this.map.setCenter({ lat: this.lat, lng: this.long, alt: 0 });
      marker.setPosition({ lat: data.lat, lng: data.long, alt: 0 });
      console.log(marker.getPosition());
    }

    // this.lineCoordinates.push(new google.maps.LatLng(this.lat, this.long));

    // let lineCoordinatesPath = new google.maps.Polyline({
    //   path: this.lineCoordinates,
    //   geodesic: true,
    //   map: this.map,
    //   strokeColor: "#FF0000",
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2,
    // });
  }

  findCollectorByID() {
    var id = this.collID;
    this.getCollectorWithLog(id);
    for (let coll of this.markers) {
      if (id == coll.id) {
        this.map.panTo(coll.marker.getPosition());
      }
    }
  }

  getLocation() {
    this.findCollectorByID();
  }

  getCollectorWithLog(id) {
    this.loading = true;
    let form = this.processForm(id);
    this.Auth.getCollectorWithLog(form).subscribe(
      (data) => this.handleCollectorGetResponse(data),
      (error) => this.handleCollectorGetError(error)
    );
  }

  handleCollectorGetResponse(data) {
    this.displayedCollector = data.collector;
    this.displayedCollectorRequests = data.pickups;
    this.loading = false;
  }

  handleCollectorGetError(error) {
    console.log(error);
    this.loading = false;
  }

  processForm(id) {
    var formData = {
      adminPhone: this.token.phone,
      collectorID: id,
    };
    return formData;
  }

  formatMaterials(mat) {
    return JSON.parse(mat);
  }

  assignToRequest() {
    this.nav.navigate(
      "/dashboard/pickup-requests/assign_to_" + this.collID,
      this.collID
    );
  }
}

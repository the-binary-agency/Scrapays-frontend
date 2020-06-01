import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor () { }
  
  public backendUrl = "https://scrapays.com/server";
  // public backendUrl = "http://localhost:8000";
  public API_KEY ="RoHclc0n3WYL9l4oLK8APfU3mjkTwRQj5bt5WDkSyFXOLIobj3exJl3v+/n1c"

}

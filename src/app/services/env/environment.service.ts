import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EnvironmentService {
  constructor() {}

  // public backendUrl = "https://api.scrapays.com";
  public backendUrl =
    document.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://api.scrapays.com";
  public API_KEY =
    "RoHclc0n3WYL9l4oLK8APfU3mjkTwRQj5bt5WDkSyFXOLIobj3exJl3v+/n1c";
}

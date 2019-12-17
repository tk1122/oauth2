import { Injectable } from "@angular/core";
import { LocalStorageObject } from "../shared/models/local-storage";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  localStorageObject: LocalStorageObject;
  constructor() {}

  saveAccessToken() {
    localStorage.setItem(
      "LOCAL_STORAGE",
      JSON.stringify(this.localStorageObject)
    );
  }
}

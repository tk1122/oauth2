import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class OauthServiceService {
  constructor(private http: HttpClient) {}
  private api = environment.API;

  login(username: string, password: string) {
    return this.http.post(this.api + "/api/oauth/get_access_token", {
      username,
      password
    });
  }
}

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
    return this.http.post(this.api + "/oauth/get_access_token", {
      username,
      password,
      grant_type: "password"
    });
  }

  getAppInfo(redirectUri: string, clientId: string, scope: string) {
    return this.http.post(
      this.api + "/api/app/get_oauth_app",
      {
        redirect_uri: redirectUri,
        client_id: clientId,
        scope
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
  }

  getAuthCode(redirectUri: string, clientId: string, scope: string) {
    return this.http.post(
      this.api + "/oauth/create_oauth_request",
      {
        redirect_uri: redirectUri,
        client_id: clientId,
        scope,
        response_type: "code"
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
  }

  getUserInfo() {
    return this.http.get(this.api + "/api/info/get_user_info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
  }

  getSecretInfo() {
    return this.http.get(this.api + 'api/secret/get_secret_info' , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {OauthServiceService} from "../../../services/oauth-service.service";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {
  params: Params;
  app : {
    name: string,
    scope: string | string[];
  };
  done = false;
  error = false;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly oauthService: OauthServiceService) { }

  getAppInfo() {
    this.oauthService.getAppInfo(this.params.redirect_uri, this.params.client_id, this.params.scope).subscribe(res => {
      console.log(res);
      // @ts-ignore
      if (!res.success) {
        this.error = true;
      }
      // @ts-ignore
      this.app = res;
      // @ts-ignore
      this.app.scope = this.app.scope.split(" ");
      this.done = true;
    }, error1 => {
      this.error = true;
    })
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    this.route.queryParams.subscribe((params: Params) => {
      this.params = params;
    });
    if (!accessToken) {
      return this.router.navigateByUrl(`/login?redirect_uri=${this.params.redirect_uri}&client_id=${this.params.client_id}&scope=${this.params.scope}`)
    }
    this.getAppInfo()
  }

  accept() {
    this.oauthService.getAuthCode(this.params.redirect_uri, this.params.client_id, this.params.scope).subscribe(res => {
      // @ts-ignore
      return window.location.href = `${this.params.redirect_uri}?code=${res.code}`
    }, error1 => {
      return window.location.href = `${this.params.redirect_uri}?error=true`
    })
  }

  reject() {
    return window.location.href = `${this.params.redirect_uri}?reject=true`
  }
}

import { Component, OnInit } from '@angular/core';
import {OauthServiceService} from "../../services/oauth-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;
  constructor(private readonly oauthService: OauthServiceService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.oauthService.getUserInfo().subscribe(res => {
      this.user = res;
    })
  }
}

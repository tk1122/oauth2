import { Component, OnInit } from '@angular/core';
import {OauthServiceService} from "../../services/oauth-service.service";

@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent implements OnInit {
  user: any;

  constructor(private readonly oauthService: OauthServiceService) { }

  ngOnInit() {
    this.getSecretInfo()
  }

  getSecretInfo() {
    this.oauthService.getSecretInfo().subscribe(res => {
      this.user = res;
    })
  }
}

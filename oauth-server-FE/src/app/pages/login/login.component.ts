import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { OauthServiceService } from "src/app/services/oauth-service.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  params: Params;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private oauthService: OauthServiceService,
    private router: Router
  ) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();

      this.oauthService
        .login(
          this.validateForm.get("userName").value,
          this.validateForm.get("password").value
        )
        .subscribe((res: any) => {
          if (!res.success) {
            return;
          }
          localStorage.setItem('accessToken', res.accessToken);
          if (!this.params.redirect_uri) {
            return this.router.navigate(["home"]);
          }

          return this.router.navigateByUrl(`/oauth2/authorize?redirect_uri=${this.params.redirect_uri}&client_id=${this.params.client_id}&scope=${this.params.scope}`)
        });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });

    this.route.queryParams.subscribe((params: Params) => {
      this.params = params;
    });
  }
}

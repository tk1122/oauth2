import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { AuthorizeComponent } from "./pages/oauth2/authorize/authorize.component";
import { TokenComponent } from "./pages/oauth2/token/token.component";
import { HomeComponent } from "./pages/home/home.component";
import { SecretComponent } from "./pages/secret/secret.component";
import { OauthAppComponent } from "./pages/oauth-app/oauth-app.component";
import {TokenGuard} from "./shared/guards/token.guard";
import {ErrorComponent} from "./pages/error/error.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "oauth2/authorize",
    component: AuthorizeComponent
  },
  {
    path: "oauth2/token",
    component: TokenComponent
  },
  {
    path: "",
    canActivateChild: [TokenGuard],
    children: [
      {
        path: "home",
        component: HomeComponent
      },
      {
        path: "secret",
        component: SecretComponent
      },
      {
        path: "oauth-app",
        component: OauthAppComponent
      }
    ]
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: "**",
    redirectTo: '/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

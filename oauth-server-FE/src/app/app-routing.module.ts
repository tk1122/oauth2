import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { AuthorizeComponent } from "./pages/oauth2/authorize/authorize.component";
import { TokenComponent } from "./pages/oauth2/token/token.component";

const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

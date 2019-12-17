import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthorizeComponent } from "./pages/oauth2/authorize/authorize.component";
import { TokenComponent } from "./pages/oauth2/token/token.component";
import { SecretComponent } from "./pages/secret/secret.component";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {NgZorroAntdModule, NZ_I18N, en_US, NzCardModule} from "ng-zorro-antd";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { HomeComponent } from './pages/home/home.component';
import { OauthAppComponent } from './pages/oauth-app/oauth-app.component';
import { ErrorComponent } from './pages/error/error.component';
import {TokenGuard} from "./shared/guards/token.guard";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthorizeComponent,
    TokenComponent,
    SecretComponent,
    HomeComponent,
    OauthAppComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    FormsModule,
    BrowserAnimationsModule,
    NzCardModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, TokenGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}

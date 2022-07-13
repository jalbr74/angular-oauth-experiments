import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManualOauthStepsComponent } from './pages/manual-oauth-steps/manual-oauth-steps.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SelfProtectedComponentComponent } from './pages/self-protected-component/self-protected-component.component';
import { ProtectedResourceComponent } from './pages/using-route-guards/protected-resource/protected-resource.component';
import { UnprotectedResourceComponent } from './pages/using-route-guards/unprotected-resource/unprotected-resource.component';
import { UsingRouteGuardsComponent } from './pages/using-route-guards/using-route-guards.component';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        ManualOauthStepsComponent,
        LandingComponent,
        SelfProtectedComponentComponent,
        ProtectedResourceComponent,
        UnprotectedResourceComponent,
        UsingRouteGuardsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        OAuthModule.forRoot(),
    ],
    providers: [
        { provide: OAuthStorage, useFactory: () => localStorage },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

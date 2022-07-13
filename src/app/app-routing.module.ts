import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualOauthStepsComponent } from './pages/manual-oauth-steps/manual-oauth-steps.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SelfProtectedComponentComponent } from './pages/self-protected-component/self-protected-component.component';
import { UsingRouteGuardsComponent } from './pages/using-route-guards/using-route-guards.component';
import { ProtectedResourceComponent } from './pages/using-route-guards/protected-resource/protected-resource.component';
import { UnprotectedResourceComponent } from './pages/using-route-guards/unprotected-resource/unprotected-resource.component';

const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'manual', component: ManualOauthStepsComponent },
    { path: 'self-protected-component', component: SelfProtectedComponentComponent },
    {
        path: 'using-route-guards', component: UsingRouteGuardsComponent, children: [
            { path: 'protected', component: ProtectedResourceComponent },
            { path: 'unprotected', component: UnprotectedResourceComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

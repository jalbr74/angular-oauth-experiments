import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';

const OAUTH_SETTINGS = {
    baseUrl: "https://vlab027732.dom027700.lab/osp/a/TOP/auth/oauth2",
    clientID: "id-TppF2ejSXOuQUt2PaYxIPTOCtVzff70j",
    clientSecret: "secret-N6uLsTEpIvcAX9moXgWM8t23V8G95hML",
    redirectUri: "http://localhost:4200/oauth-experiments/using-route-guard",
};

export interface UserProfile {
    info: {
        email?: string;
        family_name?: string;
        given_name?: string;
        preferred_username?: string;
        sub?: string;
        user_dn?: string;
        tenantname?: string;
        repository_name?: string;
        user_name?: string;
        combinedTenantRepoUserName?: string;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    discoveryDocumentLoaded: Promise<void>;

    constructor(
        private router: Router,
        private oauthService: OAuthService,
        private httpClient: HttpClient
    ) {
        this.oauthService.configure({
            issuer: OAUTH_SETTINGS.baseUrl,
            clientId: OAUTH_SETTINGS.clientID,
            dummyClientSecret: OAUTH_SETTINGS.clientSecret,
            redirectUri: OAUTH_SETTINGS.redirectUri,
            // The full list of scope variables can be found in authcfg.xml, basically everything with a "clientName" attribute
            scope: 'openid profile email api offline_access user_dn tenantname tenantid repository_name user_name',
            responseType: 'code', // We should be using 'code' instead of 'implicit'
            showDebugInformation: true,
            userinfoEndpoint: `${OAUTH_SETTINGS.baseUrl}/userinfo`
        });

        this.discoveryDocumentLoaded = this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            if (this.isAuthenticated()) {
                // Should we set up the silent refresh here?

                // this.oauthService.scope = '';
                // this.oauthService.setupAutomaticSilentRefresh();
            } else {

            }
        })
    }

    async ensureDiscoveryDocumentIsLoaded(): Promise<void> {
        if (this.oauthService.discoveryDocumentLoaded) {
            return Promise.resolve();
        }

        // this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
        //     if (!this.oauthService.hasValidIdToken() || !this.oauthService.hasValidAccessToken()) {
        //         this.oauthService.initImplicitFlow('some-state');
        //     }
        // });

        // Same as calling loadDiscoveryDocument() then tryLoginCodeFlow() (since responseType is set to "code")
        console.log('Calling loadDiscoveryDocumentAndTryLogin()...');
        return this.oauthService.loadDiscoveryDocumentAndTryLogin().then();

        // this.oauthService.loadDiscoveryDocumentAndLogin();

        // await this.oauthService.loadDiscoveryDocument()
        //     .then(() => {
        //         if (!this.isAuthenticated()) {
        //             const params = new URLSearchParams(window.location.search);
        //             if (params.get('code')) {
        //                 console.log('Detected OAuth redirection info');
        //
        //                 // If a "code" query parameter was supplied in the URL, it means the OAuth server is providing authentication tokens.
        //                 // Better put them to use:
        //                 return this.oauthService.tryLoginCodeFlow();
        //             }
        //         }
        //
        //         return;
        //     })
        //     .catch((error) => {
        //         console.error('Error loading discovery document', error);
        //         throw error;
        //     })
    }

    /**
     * Authenticated means has valid access and ID tokens, but the tokens could be expired.
     */
    isAuthenticated(): boolean {
        return this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
    }

    authenticate(): void {
        this.oauthService.initLoginFlow();
    }

    async getAuthenticatedUserProfile(): Promise<UserProfile> {
        if (!this.oauthService.hasValidAccessToken() || this.oauthService.getAccessTokenExpiration() <= Date.now()) {
            this.oauthService.initLoginFlow();

            return Promise.resolve({ info: {} });
        }

        return await this.oauthService.loadUserProfile() as UserProfile;
    }

    logout() {
        this.oauthService.logOut();
    }
}

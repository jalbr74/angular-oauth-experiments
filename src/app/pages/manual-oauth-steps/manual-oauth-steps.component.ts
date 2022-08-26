import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { OAuthSuccessEvent } from 'angular-oauth2-oidc/events';
import { Subscription } from 'rxjs';

const OAUTH_SETTINGS = {
    baseUrl: "https://vlab027732.dom027700.lab/osp/a/TOP/auth/oauth2",
    clientID: "id-7N635ozThTuOJYx7sRjnxMs5KntrqNf2",
    clientSecret: "secret-c1bZDuNYIv9LqKwbO0Bv3wIXUsYQOQf0",
    redirectUri: "http://localhost:4200/manual",
};

export interface OauthExperimentsState {
    discoveryDocumentLoaded: boolean;
    hasValidAccessToken: boolean;
    accessTokenExpiration: number;
    hasValidIdToken: boolean;
    idTokenExpiration: number;
}

@Component({
    selector: 'app-manual-oauth-steps',
    templateUrl: './manual-oauth-steps.component.html',
    styleUrls: ['./manual-oauth-steps.component.scss'],
})
export class ManualOauthStepsComponent implements OnDestroy {
    state!: OauthExperimentsState;
    sub: Subscription;

    isDiscoveryDocumentLoaded = false;

    username = '';
    userDn = '';

    constructor(
        private router: Router,
        private oauthService: OAuthService
    ) {
        this.updateState();

        this.oauthService.configure({
            issuer: OAUTH_SETTINGS.baseUrl,
            clientId: OAUTH_SETTINGS.clientID,
            dummyClientSecret: OAUTH_SETTINGS.clientSecret,
            redirectUri: OAUTH_SETTINGS.redirectUri,
            scope: 'openid profile email api offline_access user_dn tenantname tenantid repository_name user_name', // See: authcfg.xml
            responseType: 'code', // We should be using 'code' instead of 'implicit'
            showDebugInformation: true,
        });

        this.sub = this.oauthService.events.subscribe((oauthEvent: OAuthEvent) => {
            console.log('OAuth Event: %O', oauthEvent);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    updateState() {
        const newState: OauthExperimentsState = {
            discoveryDocumentLoaded: this.oauthService.discoveryDocumentLoaded,
            hasValidAccessToken: this.oauthService.hasValidAccessToken(),
            accessTokenExpiration: this.oauthService.getAccessTokenExpiration(),
            hasValidIdToken: this.oauthService.hasValidIdToken(),
            idTokenExpiration: this.oauthService.getIdTokenExpiration(),
        };

        this.state = { ...newState };

        console.log('State has been updated');
    }

    printOauthService() {
        console.log('OAuth Service: %O', this.oauthService);
        console.log('has valid access token: %O', this.oauthService.hasValidAccessToken());
        console.log('Identity claims: %O', this.oauthService.getIdentityClaims());
    }

    /**
     * This connects to the OSP, and gets the URLs for all the other stuff we may want to do, then it makes another network call to
     * fetch the keys (using the jwks_uri from the discovery document)
     *
     * URLs requested:
     * 1: /osp/a/TOP/auth/oauth2/.well-known/openid-configuration
     * 2: /osp/a/TOP/auth/oauth2/jwks
     */
    async loadDiscoveryDocument() {
        try {
            const success: OAuthSuccessEvent = await this.oauthService.loadDiscoveryDocument();
            console.log('OAuthSuccessEvent: %O', success);
            this.isDiscoveryDocumentLoaded = true;
            this.updateState();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Starts the Authentication process.
     *
     * Sends the user to the login page for authentication, and comes back to a mutually agreed upon "redirect URL" with information in
     * the URL parameter: "code". This information can be decoded and used to request the tokens (id, access, refresh) when
     * tryLoginCodeFlow() is called.
     *
     * The user will usually be presented with a login screen, but if the OSP doesn't feel a login is necessary, the user is immediately
     * redirected back, with the "code" URL parameter populated.
     *
     * If the tokens have expired, but the user is still authenticated to the OSP, you can call this, and the page will seem to just
     * refresh but be given a new value for the "code" URL query parameter. The user was sent to the OSP's login page, but it deemed the
     * user didn't need to log in again, so the OSP sent the user back to the configured redirect URL.
     */
    initLoginFlow() {
        if (!this.oauthService.discoveryDocumentLoaded) {
            alert('Discovery document needs to be loaded first!');
            return;
        }

        try {
            this.oauthService.initLoginFlow();
            this.updateState();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Decodes the information in the URL parameter: "code", and makes a request to the OAuth server to fetch the ID, access, and
     * refresh tokens (you only get the code parameter when you've been redirected from the OSP after a successful login).
     *
     * URL requested:
     * /osp/a/TOP/auth/oauth2/token
     */
    async tryLoginCodeFlow() {
        if (!this.oauthService.discoveryDocumentLoaded) {
            alert('Discovery document needs to be loaded first!');
            return Promise.resolve();
        }

        try {
            await this.oauthService.tryLoginCodeFlow();
            this.updateState();

            console.log('this.oauthService.state: %O', this.oauthService.state);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This makes a call to the getuserinfo endpoint, and returns juicy information about the user. It requires a valid access token.
     * Note: A token can be valid even when expired, so need to check the expiration.
     */
    async loadUserProfile() {
        try {
            const userProfile: any = await this.oauthService.loadUserProfile();

            this.username = userProfile.info.user_name;
            this.userDn = userProfile.info.user_dn;

            console.log('User profile: %O', userProfile);
        } catch (error) {
            console.error(error);
        }
    }

    setupAutomaticSilentRefresh() {
        this.oauthService.scope = '';
        this.oauthService.setupAutomaticSilentRefresh();
        console.log('Automatic silent refresh started');
    }

    printAuthorizationHeader() {
        console.log('Authorization header:');
        console.log(this.oauthService.authorizationHeader());
    }
}

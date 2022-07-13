import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth-guard/auth.service';

@Component({
    selector: 'app-using-route-guard',
    templateUrl: './using-route-guard.component.html',
    styleUrls: ['./using-route-guard.component.scss'],
})
export class UsingRouteGuardComponent implements OnInit {
    username: string = '';
    userDn: string = '';
    accessTokenExpiration = 0;

    constructor(private authService: AuthService) {
    }

    async ngOnInit() {
        const userProfile = await this.authService.getAuthenticatedUserProfile();

        console.log('userProfile: %O', userProfile);

        this.username = userProfile.info.preferred_username ?? '';
        this.userDn = userProfile.info.user_dn ?? '';
    }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@modules/auth/services';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'sb-top-nav-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './top-nav-user.component.html',
    styleUrls: ['top-nav-user.component.scss'],
})
export class TopNavUserComponent implements OnInit {
    constructor(
        public userService: UserService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {}
    ngOnInit() {}
    doLogout() {
        this.localStorageService.clear('auth_token');
        this.localStorageService.clear('tenders');
        this.router.navigate(['auth']);
    }
}

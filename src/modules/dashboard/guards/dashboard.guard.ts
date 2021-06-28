import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';

@Injectable()
export class DashboardGuard implements CanActivate {
    constructor(private localStorageService: LocalStorageService, private router: Router) {}
    canActivate(): Observable<boolean> {
        if (!this.localStorageService.retrieve('auth_token')) {
            this.router.navigate(['auth/login']);
            return of(false);
        }
        return of(true);
    }
}

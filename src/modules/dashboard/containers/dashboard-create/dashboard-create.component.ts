import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@modules/auth/models';
import { Tender } from '@modules/tables/models';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject } from 'rxjs';
import { UserService } from '../../../auth/services/user.service';

@Component({
    selector: 'sb-dashboard-create',
    templateUrl: './dashboard-create.component.html',
    styleUrls: ['./dashboard-create.component.scss'],
})
export class DashboardCreateComponent implements OnInit {
    tender: Tender;
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private toastr: ToastrService,
        private userService:UserService
    ) {
        this.tender = localStorageService.retrieve('tenderdetail');
    }
    disabled = false;
    isEdit = true;
    buttonText = 'Submit';
    tenderListTemp: Tender[] | any;
    tenderId: string | any;
    method = 'create';
    ngOnInit(): void {}

    goToList() {
        this.router.navigate(['tender']);
    }
    save(event: any) {
        this.tenderListTemp = this.localStorageService.retrieve('tenders');
        let counter=this.localStorageService.retrieve('counter');
        counter = counter +1;
        event.tenderId = counter;
        this.userService.user$.forEach((data: User) => {
            event.tenderCreator=data.firstName+' '+data.lastName;
        });
        this.tenderListTemp.push(event);
        this.localStorageService.store('tenders', this.tenderListTemp);
        this.localStorageService.store('counter',counter);
        this.tenderId = event.tenderId;
        this.router.navigate(['tender']);
        this.showSuccess();
    }

    showSuccess() {
        const message = 'Tender ID: ' + this.tenderId + ' Successfuly Updated!';
        this.toastr.success(message, 'Congrats');
    }
}

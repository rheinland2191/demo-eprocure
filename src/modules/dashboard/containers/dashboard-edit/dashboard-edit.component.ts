import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';

import { Tender } from '../../../tables/models/tenders.model';

@Component({
    selector: 'sb-dashboard-edit',
    templateUrl: './dashboard-edit.component.html',
    styleUrls: ['./dashboard-edit.component.scss'],
})
export class DashboardEditComponent implements OnInit {
    tender: Tender;
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private toastr: ToastrService
    ) {
        this.tender = localStorageService.retrieve('tenderdetail');
    }
    disabled = false;
    isEdit = true;
    buttonText = 'Update';
    tenderListTemp: Tender[] | any;
    tenderId: string | any;
    method = 'edit';
    ngOnInit(): void {}

    goToList() {
        this.router.navigate(['tender']);
    }
    save(event: any) {
        this.tenderListTemp = this.localStorageService.retrieve('tenders');
        this.tenderListTemp.forEach((data: any, index: any) => {
            if (data.tenderId === event.tenderId) {
                this.tenderListTemp[index].tenderId = event.tenderId;
                this.tenderListTemp[index].tenderNumber = event.tenderNumber;
                this.tenderListTemp[index].tenderName = event.tenderName;
                this.tenderListTemp[index].tenderClosingDate = event.tenderClosingDate;
                this.tenderListTemp[index].tenderReleaseDate = event.tenderReleaseDate;
                this.tenderListTemp[index].description = event.description;
            }
        });
        this.localStorageService.store('tenders', this.tenderListTemp);
        this.tenderId = event.tenderId;
        this.router.navigate(['tender']);
        this.showSuccess();
    }

    showSuccess() {
        const message = 'Tender ID: ' + this.tenderId + ' Successfuly Updated!';
        this.toastr.success(message, 'Congrats');
    }
}

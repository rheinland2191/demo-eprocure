import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tender } from '@modules/tables/models';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'sb-dashboard-detail-1',
    templateUrl: './dashboard-detail.component.html',
    styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
    constructor(private router: Router, private localStorageService: LocalStorageService) {
        this.tender = localStorageService.retrieve('tenderdetail');
    }
    tender: Tender;
    disabled = true;
    isEdit = false;
    buttonText = '';
    method = 'view';

    ngOnInit(): void {}
    goToList() {
        this.router.navigate(['tender']);
    }
    goToEdit() {
        this.router.navigate(['tender/edit/', this.tender.tenderId]);
    }
}

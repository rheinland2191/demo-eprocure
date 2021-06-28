import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { SBSortableHeaderDirective, SortEvent } from '@modules/tables/directives';
import { Tender } from '@modules/tables/models';
import { TenderService } from '@modules/tables/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-ng-bootstrap-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './ng-bootstrap-table.component.html',
    styleUrls: ['ng-bootstrap-table.component.scss'],
})
export class NgBootstrapTableComponent implements OnInit {
    @Input() pageSize = 4;

    tenders$!: Observable<Tender[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    tenderId: string | any;
    tenderListTemp: Tender[] | any;
    counter:number=0;
    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    constructor(
        public tenderService: TenderService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private modalService: NgbModal,
        private localStorageService: LocalStorageService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.tenderService.pageSize = this.pageSize;
        this.tenders$ = this.tenderService.tenders$;
        this.total$ = this.tenderService.total$;
        this.localStorageService.clear('tenderdetail');
        if(!this.localStorageService.retrieve('counter')){
            this.counter=this.localStorageService.retrieve('tenders').length;
            this.localStorageService.store('counter',this.counter);
        }
    }
    restructData() {
        this.tenderService.pageSize = this.pageSize;
        this.tenders$ = this.tenderService.tenders$;
        this.total$ = this.tenderService.total$;
    }
    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.tenderService.sortColumn = column;
        this.tenderService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
    goToDetail(tender: Tender) {
        this.localStorageService.store('tenderDetail', tender);
        this.router.navigate(['/tender/detail/', tender.tenderId]);
    }
    goToEdit(tender: Tender) {
        this.localStorageService.store('tenderDetail', tender);
        // this.showSuccess();
        this.router.navigate(['/tender/edit/', tender.tenderId]);
    }
    goToDelete(content: any, tender: Tender) {
        this.tenderId = tender.tenderId;
        this.modalService.open(content, { centered: true });
    }
    goToCreate() {
        this.router.navigate(['/tender/create']);
    }
    delete() {
        this.tenderListTemp = this.localStorageService.retrieve('tenders');
        this.tenderListTemp.forEach((data: any, index: any) => {
            if (data.tenderId === this.tenderId) {
                this.tenderListTemp.splice(index, 1);
            }
        });
        this.localStorageService.store('tenders', this.tenderListTemp);
        this.restructData();
        this.modalService.dismissAll();
        this.showSuccess();
    }
    cancel() {
        this.modalService.dismissAll();
    }
    showSuccess() {
        const message = 'Tender ID: ' + this.tenderId + ' Already Deleted!';
        this.toastr.success(message, 'Congrats');
    }
}

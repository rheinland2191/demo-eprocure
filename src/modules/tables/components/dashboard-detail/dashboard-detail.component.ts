import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Tender } from '@modules/tables/models';
import {
    NgbDate,
    NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'sb-dashboard-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard-detail.component.html',
    styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
    @Input() tender: Tender = {} as Tender;
    @Input() isEdit = false;
    @Input() buttonText = '';
    @Input() method = '';
    @Output() submit = new EventEmitter();
    releaseDate: NgbDateStruct | undefined;
    closingDate: NgbDateStruct | undefined;
    releaseTime = { hour: 0, minute: 0 };
    closingTime = { hour: 0, minute: 0 };
    value: any;
    formData: any;
    minDate: any;
    maxDate = { year: 2099, month: 12, day: 31 };
    tabs = ['Tender Info'];
    active: any;
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private fb: FormBuilder
    ) {
        this.formData = this.fb.group({
            tenderNumber: [null, [Validators.required]],
            tenderName: [null, [Validators.required]],
            tenderClosingDate: [null, [Validators.required,checkSelectedDate]],
            tenderReleaseDate: [null, [Validators.required,checkSelectedDate]],
            tenderClosingTime: [{ hour: 0, minute: 0 }, [Validators.required]],
            tenderReleaseTime: [{ hour: 0, minute: 0 }, [Validators.required]],
            description: [null, [Validators.required]]
        },{validator: this.customValidator});
        if (this.localStorageService.retrieve('tenderdetail')) {
            this.tender = localStorageService.retrieve('tenderdetail');

            const releaseDate = new Date(this.tender.tenderReleaseDate);
            const closingDate = new Date(this.tender.tenderClosingDate);
            const releaseDateYear: number = releaseDate.getFullYear();
            const releaseDateMonth: number = releaseDate.getMonth() + 1;
            const releaseDateDate: number = releaseDate.getDate();

            const closingDateYear: number = closingDate.getFullYear();
            const closingDateMonth: number = closingDate.getMonth() + 1;
            const closingDateDate: number = closingDate.getDate();

            this.releaseDate = {
                year: releaseDateYear,
                month: releaseDateMonth,
                day: releaseDateDate,
            };
            this.releaseTime.hour = releaseDate.getHours();
            this.releaseTime.minute = releaseDate.getMinutes();

            this.closingDate = {
                year: closingDateYear,
                month: closingDateMonth,
                day: closingDateDate,
            };
            this.closingTime.hour = closingDate.getHours();
            this.closingTime.minute = closingDate.getMinutes();
            this.formData.get('tenderNumber').patchValue(this.tender.tenderNumber);
            this.formData.get('tenderName').patchValue(this.tender.tenderName);
            this.formData.get('tenderClosingDate').patchValue(this.closingDate);
            this.formData.get('tenderReleaseDate').patchValue(this.releaseDate);
            this.formData.get('tenderClosingTime').patchValue(this.closingTime);
            this.formData.get('tenderReleaseTime').patchValue(this.releaseTime);
            this.formData.get('description').patchValue(this.tender.description);

        }
    }
    ngOnInit(): void {
        const currentDate = new Date();
        const yearToday: number = currentDate.getFullYear();
        const monthToday: number = currentDate.getMonth() + 1;
        const dayToday: number = currentDate.getDate() + 1;
        this.minDate = { year: yearToday, month: monthToday, day: dayToday };
        if (this.method === 'view') {
              this.formData.controls['tenderName'].disable();
              this.formData.controls['tenderNumber'].disable();
              this.formData.controls['tenderClosingDate'].disable();
              this.formData.controls['tenderReleaseDate'].disable();
              this.formData.controls['tenderReleaseTime'].disable();
              this.formData.controls['tenderClosingTime'].disable();
              this.formData.controls['description'].disable();
        }
    }
    goToList() {
        this.router.navigate(['tender']);
    }
    save(events: any) {
        this.tender.tenderNumber=this.formData.get('tenderNumber').value;
        this.tender.tenderName=this.formData.get('tenderName').value;
        this.tender.description=this.formData.get('description').value;
        const closingDate:null| NgbDate = NgbDate.from(this.formData.get('tenderClosingDate').value);
        const releaseDate:null | NgbDate = NgbDate.from(this.formData.get('tenderReleaseDate').value);
        if(closingDate!== null && releaseDate!== null){
            const jsClosingDate = new Date(closingDate.year, closingDate.month - 1, closingDate.day);
            jsClosingDate.setHours(this.formData.get('tenderClosingTime').value.hour);
            jsClosingDate.setMinutes(this.formData.get('tenderClosingTime').value.minute);
            this.tender.tenderClosingDate = jsClosingDate;
            const jsReleaseDate = new Date(releaseDate.year, releaseDate.month - 1, releaseDate.day);
            jsReleaseDate.setHours(this.formData.get('tenderReleaseTime').value.hour);
            jsReleaseDate.setMinutes(this.formData.get('tenderReleaseTime').value.minute);
            this.tender.tenderReleaseDate = jsReleaseDate;
        }

        this.submit.emit(this.tender);
    }

    customValidator: ValidatorFn = (fg: null|AbstractControl) => {
        if(fg !== null){
                const releaseDate = fg.get('tenderReleaseDate')?.value;
                const closingDate = fg.get('tenderClosingDate')?.value;
                const releaseTime = fg.get('tenderReleaseTime')?.value;
                const closingTime = fg.get('tenderClosingTime')?.value;
                if(closingDate !== null && releaseDate !== null){
                    let closeDay: null| NgbDate = NgbDate.from(closingDate);
                    let releaseDay: null|NgbDate = NgbDate.from(releaseDate);
                    if(closeDay !== null && releaseDay !== null){
                        const jsReleaseDate = new Date(releaseDay.year, releaseDay.month - 1, releaseDay.day);
                        const jsClosingDate = new Date(closeDay.year, closeDay.month - 1, closeDay.day);
        
                        jsClosingDate.setHours(closingTime.hour);
                        jsClosingDate.setMinutes(closingTime.minute);;
                        jsReleaseDate.setHours(releaseTime.hour);
                        jsReleaseDate.setMinutes(releaseTime.minute);
                        if (jsReleaseDate.getTime() >= jsClosingDate.getTime()) {
                            return {
                            customRules: true
                            };
                        }
                    }
            
                }
        }
        
        return null;
        }
        
}

export function checkSelectedDate(control: AbstractControl) {
    let returnValue;
    if(control.value == undefined){
      return null;
    }
    else {
        const currentDate = new Date();
        let selectedDate:null| NgbDate = NgbDate.from(control.value);
        if(selectedDate !== null ){
            const jsSelectedDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
            if(currentDate.getTime()<jsSelectedDate.getTime()){
                returnValue = true;
            }
            else{
                returnValue = false;
            }
            if(!returnValue){
                return { dateInvalid:true};
            }
        }
        
        return null;
    }
  }

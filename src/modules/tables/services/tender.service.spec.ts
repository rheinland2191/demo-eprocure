import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { TenderService } from './tender.service';

describe('CountryService', () => {
    let tenderService: TenderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TenderService, DecimalPipe],
        });
        tenderService = TestBed.inject(TenderService);
    });

    describe('countries$', () => {
        it('should return Observable<Country[]>', () => {
            tenderService.tenders$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});

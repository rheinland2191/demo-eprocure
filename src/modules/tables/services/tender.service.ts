import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { TENDERS } from '@modules/tables/data/tenders';
import { SortDirection } from '@modules/tables/directives';
import { Tender } from '@modules/tables/models';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

interface SearchResult {
    tenders: Tender[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

function compare(v1: Date | string, v2: Date | string) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: Tender[], column: string, direction: string): Tender[] {
    if (direction === '') {
        return countries;
    } else if (column === 'releaseDate') {
        return [...countries].sort((a, b) => {
            const res =
                (new Date(b.tenderReleaseDate) as any) - (new Date(a.tenderReleaseDate) as any);
            return direction === 'asc' ? res : -res;
        });
    } else if (column === 'closingDate') {
        return [...countries].sort((a, b) => {
            const res =
                (new Date(b.tenderClosingDate) as any) - (new Date(a.tenderClosingDate) as any);
            return direction === 'asc' ? res : -res;
        });
    } else {
        return [...countries].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

@Injectable({ providedIn: 'root' })
export class TenderService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _tenders$ = new BehaviorSubject<Tender[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 4,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(private pipe: DecimalPipe, private localStorageService: LocalStorageService) {
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                debounceTime(120),
                switchMap(() => this._search()),
                delay(120),
                tap(() => this._loading$.next(false))
            )
            .subscribe(result => {
                this._tenders$.next(result.tenders);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get tenders$() {
        return this._tenders$.asObservable();
    }
    get total$() {
        return this._total$.asObservable();
    }
    get loading$() {
        return this._loading$.asObservable();
    }
    get page() {
        return this._state.page;
    }
    set page(page: number) {
        this._set({ page });
    }
    get pageSize() {
        return this._state.pageSize;
    }
    set pageSize(pageSize: number) {
        this._set({ pageSize });
    }
    get searchTerm() {
        return this._state.searchTerm;
    }
    set searchTerm(searchTerm: string) {
        this._set({ searchTerm });
    }
    set sortColumn(sortColumn: string) {
        this._set({ sortColumn });
    }
    set sortDirection(sortDirection: SortDirection) {
        this._set({ sortDirection });
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
        let dataTender;
        if (this.localStorageService.retrieve('tenders')) {
            dataTender = this.localStorageService.retrieve('tenders');
        } else {
            this.localStorageService.store('tenders', TENDERS);
            dataTender = this.localStorageService.retrieve('tenders');
        }
        // 1. sort
        let tenders = sort(dataTender, sortColumn, sortDirection);

        // 2. filter
        const total = tenders.length;

        // 3. paginate
        tenders = tenders.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ tenders, total });
    }
}

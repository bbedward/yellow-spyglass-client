import { ChangeDetectorRef, Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { RepresentativeDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
// eslint-disable-next-line no-duplicate-imports
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-large-rep-table',
    template: `
        <table
            mat-table
            [hidden]="vp.sm"
            responsive
            [dataSource]="largeRepsDataSource"
            #sortAll="matSort"
            matSort
            class="mat-elevation-z2 all-reps-table"
        >
            <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let i = index" style="padding-right: 12px">{{ i + 1 }}</td>
            </ng-container>

            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Representative</th>
                <td mat-cell *matCellDef="let element">
                    <div style="display: flex; flex-direction: column; justify-content: center">
                        <div style="display: flex; align-items: center">
                            <pxb-list-item-tag
                                *ngIf="element.principal"
                                class="principal-tag"
                                label="Principal"
                                style="margin-right: 12px"
                            ></pxb-list-item-tag>
                            <span class="link" style="font-weight: 600" (click)="routeRepAddress(element.address)">
                                <div
                                    *ngIf="aliasService.get(element.address)"
                                    style="white-space: nowrap; text-overflow: ellipsis; max-width: 210px; overflow: hidden"
                                >
                                    {{ aliasService.get(element.address) }}
                                </div>
                                <ng-container *ngIf="!aliasService.get(element.address)">
                                    {{ shortenAddress(element.address) }}
                                </ng-container>
                            </span>
                        </div>
                    </div>
                </td>
            </ng-container>

            <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Weight</th>
                <td mat-cell *matCellDef="let element">
                    {{ formatBanWeight(element.weight) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="percentWeight">
                <th mat-header-cell *matHeaderCellDef>%</th>
                <td mat-cell *matCellDef="let element" [class.warn]="isLargeRep(element.weight)">
                    {{ formatWeightPercent(element.weight)
                    }}<span style="font-size: 11px; font-weight: 200; margin-left: 2px">%</span>
                </td>
            </ng-container>

            <ng-container matColumnDef="delegatorsCount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Delegators</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.delegatorsCount) }}</td>
            </ng-container>

            <ng-container matColumnDef="uptimePercentMonth">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    <div style="text-align: left">
                        Uptime
                        <ng-container *ngIf="!vp.md">
                            <br />
                            <div style="font-size: 10px; margin-top: -4px">month · week · day</div>
                        </ng-container>
                    </div>
                </th>
                <td mat-cell *matCellDef="let element">
                    <span
                        [class.warn]="element.uptimePercentMonth <= 80"
                        [class.intermediary]="element.uptimePercentMonth > 80 && element.uptimePercentMonth <= 95"
                        [class.primary]="element.uptimePercentMonth > 95"
                    >
                        {{ element.uptimePercentMonth }}<span style="font-size: 11px">% </span>
                    </span>
                    <span *ngIf="!vp.md" style="font-size: 11px"
                        >· {{ element.uptimePercentWeek }}% · {{ element.uptimePercentDay }}%
                    </span>
                </td>
            </ng-container>

            <ng-container matColumnDef="online">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td
                    mat-cell
                    class="representatives-online-cell"
                    *matCellDef="let element"
                    [style.color.red]="!element.online"
                >
                    <mat-icon style="font-size: 1.5rem" [class.primary]="element.online" [class.warn]="!element.online">
                        {{ element.online ? 'check' : 'priority_high' }}</mat-icon
                    >
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="vp.md ? largeRepsDisplayColumnsMd : largeRepsDisplayColumnsLg"></tr>
            <tr
                mat-row
                style="height: 48px"
                *matRowDef="let row; columns: vp.md ? largeRepsDisplayColumnsMd : largeRepsDisplayColumnsLg"
            ></tr>
        </table>
    `,
    styleUrls: ['./large-rep-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LargeRepTableComponent implements OnChanges {
    @Input() shownReps: RepresentativeDto[] = [];
    @Input() onlineWeight: number;

    @ViewChild('sortAll') sortAll: MatSort;

    largeRepsDataSource;
    largeRepsDisplayColumnsLg = [
        'position',
        'address',
        'online',
        'weight',
        'percentWeight',
        'delegatorsCount',
        'uptimePercentMonth',
    ];
    largeRepsDisplayColumnsMd = ['position', 'address', 'online', 'weight', 'percentWeight', 'uptimePercentMonth'];

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    ngOnChanges(): void {
        this._configureTables();
    }

    private _configureTables(): void {
        if (this.shownReps.length === 0) {
            return;
        }
        this.largeRepsDataSource = new MatTableDataSource(this.shownReps);
        this._ref.detectChanges();
        this.largeRepsDataSource.sort = this.sortAll;
    }

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    routeRepAddress(address: string): void {
        if (address) {
            this._searchService.emitSearch(address);
        }
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(2).replace(/\.?0+$/, '')}`;
    }

    isLargeRep(weight: number): boolean {
        return (weight / this.onlineWeight) * 100 > 2;
    }

    shortenAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${addr.substr(addr.length - 6, addr.length)}`;
    }
}

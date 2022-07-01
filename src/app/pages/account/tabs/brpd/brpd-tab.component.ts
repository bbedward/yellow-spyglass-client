import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { TransactionsService } from '@app/pages/account/tabs/transactions/transactions.service';
import { Transaction } from '../transactions/transactions-tab.component';
import { AccountService } from '@app/pages/account/account.service';

export type FilterDialogData = {
    includeReceive: boolean;
    includeSend: boolean;
    includeChange: boolean;
    maxAmount: number;
    minAmount: number;
    filterAddresses: string;
    update?: boolean;
};

@Component({
    selector: 'account-brpd-tab',
    templateUrl: 'brpd-tab.component.html',
    styles: [
        `
            textarea:focus,
            input:focus {
                border-radius: 4px;
                border: none !important;
                outline: 0;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class BrpdTabComponent {
    @Input() isPending: boolean;
    @Input() blockCount: number;
    @Input() address: string;
    @Input() paginator: TemplateRef<PaginatorComponent>;

    DEFAULT_PAGE_SIZE = 50;
    pageIndex: number = 0;
    pageSize = this.DEFAULT_PAGE_SIZE;

    hasFiltersApplied: boolean;

    appliedPageSize = this.pageSize;
    isLoading: boolean;
    navItems = APP_NAV_ITEMS;

    filterData: FilterDialogData;
    transactions: Transaction[] = [];

    dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }> = new Map();

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService,
        public accountService: AccountService
    ) {}

    ngOnChanges(): void {
        this._loadNewAccount();
    }

    applyFilters(): void {
        this.pageIndex = 0;
        this.appliedPageSize = this.pageSize;
        this.accountService.forgetTransactions();
        this.loadCurrentPage();
        this.hasFiltersApplied = false;
        this.hasFiltersApplied ||= Boolean(this.filterData.maxAmount);
        this.hasFiltersApplied ||= Boolean(this.filterData.minAmount);
        this.hasFiltersApplied ||= Boolean(this.filterData.filterAddresses);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeSend);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeChange);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeReceive);
    }

    loadCurrentPage(): void {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;

        this.accountService
            .loadTransactionsPage(this.address, this.pageIndex, this.pageSize, this.blockCount, this.filterData)
            .then((data) => {
                this.transactions = data;
                this.txService.createDateMap(this.transactions, this.dateMap);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    copy(item: any): void {
        void navigator.clipboard.writeText(item.address || item.newRepresentative);
        item.showCopiedIcon = true;
        setTimeout(() => {
            item.showCopiedIcon = false;
        }, 700);
    }

    resetFilters(): void {
        this.pageSize = this.DEFAULT_PAGE_SIZE;
        this.hasFiltersApplied = false;
        this.filterData = {
            includeReceive: true,
            includeChange: true,
            includeSend: true,
            maxAmount: undefined,
            minAmount: undefined,
            filterAddresses: '',
        };
    }

    fetchRemoteNicknames(): void {
        const noAlias = new Set<string>();
        this.transactions.map((tx) => {
            if (!this.aliasService.has(tx.address)) {
                noAlias.add(tx.address);
            }
        });

        const tipBot = [];
        Array.from(noAlias).map((address) => {
            //   tipBot.push(this.apiService.fetchTipbotNickname(address));
        });

        Promise.all(tipBot)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    hasNickname(address: string): boolean {
        return this.aliasService.has(address);
    }

    trackByFn(index: number): number {
        return index;
    }

    formatNumber(x: number): string {
        if (isNaN(x)) {
            return;
        }
        return this.util.numberWithCommas(Number(x.toFixed(4)));
    }

    /** Move the pagination logic into this page. */
    changePage(page: number): void {
        this.pageIndex = page;
        console.log(page);
        this.loadCurrentPage();
    }

    hasFilter(): void {}

    private _loadNewAccount(): void {
        this.pageIndex = 0;
        this.transactions = [];
        this.accountService.forgetTransactions();
        this.resetFilters();
        this.loadCurrentPage();
    }
}
